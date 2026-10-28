#!/usr/bin/env python3
"""Verify that NSIS EXE visibly embeds DyclokPRO.ico (not a generic EXE icon)."""
import argparse,hashlib,io,struct
from pathlib import Path
from PIL import Image,ImageChops,ImageStat
import pefile

def sha(b):return hashlib.sha256(b).hexdigest()

def icon_chunks(ico):
 data=ico.read_bytes()
 if len(data)<22:raise RuntimeError("ICO file too short")
 reserved,kind,n=struct.unpack_from("<HHH",data)
 if (reserved,kind)!=(0,1) or n<4:raise RuntimeError("Expected a multiresolution ICO")
 pieces=[]
 for i in range(n):
  w,h,colors,res,planes,bits,size,offset=struct.unpack_from("<BBBBHHII",data,6+i*16)
  if size<=0 or offset+size>len(data):raise RuntimeError("Invalid ICO image entry")
  pieces.append((w,h,colors,res,planes,bits,data[offset:offset+size]))
 return pieces

def resources(exe):
 pe=pefile.PE(str(exe),fast_load=False)
 pe.parse_data_directories(directories=[pefile.DIRECTORY_ENTRY["IMAGE_DIRECTORY_ENTRY_RESOURCE"]])
 images={};groups=[]
 if not hasattr(pe,"DIRECTORY_ENTRY_RESOURCE"):
  raise RuntimeError("Windows NSIS executable has no PE resources")
 for typ in pe.DIRECTORY_ENTRY_RESOURCE.entries:
  category=typ.id
  if category not in (3,14):continue
  for item in typ.directory.entries:
   if not hasattr(item,"directory"):continue
   for lang in item.directory.entries:
    data=lang.data.struct
    body=pe.get_data(data.OffsetToData,data.Size)
    if category==3:images[item.id]=body
    else:groups.append((item.id,body))
 pe.close()
 return images,groups

def image_of_group(group,images):
 if len(group)<6:return None
 _,typ,count=struct.unpack_from("<HHH",group)
 if typ!=1 or count<1 or 6+14*count>len(group):return None
 entries=[];parts=[];offset=6+16*count
 for i in range(count):
  w,h,colors,res,planes,bits,size,icon_id=struct.unpack_from("<BBBBHHIH",group,6+i*14)
  data=images.get(icon_id)
  if not data:continue
  entries.append(struct.pack("<BBBBHHII",w,h,colors,res,planes,bits,len(data),offset))
  parts.append(data);offset+=len(data)
 if len(entries)<1:return None
 ico=struct.pack("<HHH",0,1,len(entries))+b"".join(entries)+b"".join(parts)
 return ico

def compare(reference,actual):
 with Image.open(io.BytesIO(reference)) as x,Image.open(io.BytesIO(actual)) as y:
  a=x.convert("RGBA").resize((48,48),Image.Resampling.LANCZOS)
  b=y.convert("RGBA").resize((48,48),Image.Resampling.LANCZOS)
  return sum(ImageStat.Stat(ImageChops.difference(a,b)).mean[:3])/3

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--installer",type=Path,required=True)
 p.add_argument("--icon",type=Path,required=True)
 p.add_argument("--label",default="NSIS installer")
 a=p.parse_args()
 expected=icon_chunks(a.icon)
 known={sha(entry[6]) for entry in expected}
 embedded,groups=resources(a.installer)
 exact=sum(sha(image) in known for image in embedded.values())
 if not groups or not embedded:raise RuntimeError("Installer has no embedded Windows icon groups")
 if len(embedded)<3:raise RuntimeError("Installer has too few icon images for Windows multi-DPI display")
 ref=a.icon.read_bytes()
 differences=[]
 for _,group in groups:
  candidate=image_of_group(group,embedded)
  if candidate is not None:
   try:differences.append(compare(ref,candidate))
   except Exception:continue
 if not differences:raise RuntimeError("Could not render any icon from Windows EXE resources")
 best=min(differences)
 # Require the embedded icon actually looks like the supplied ninja logo.
 # This catches Microsoft's generic/default installer icon even if an RT_ICON exists.
 if best>=25:
  raise RuntimeError(f"Windows embedded icon differs from DyclokPRO artwork (pixel mean difference {best:.2f})")
 if exact<1 and best>10:
  raise RuntimeError(f"Installer icon only weakly resembles provided ICO (difference={best:.2f}; exact image matches={exact})")
 print(f"WIN32_{a.label.replace(' ','_').upper()}_ICON_GROUPS={len(groups)}")
 print(f"WIN32_ICON_IMAGES={len(embedded)}")
 print(f"EXACT_ICO_ICON_IMAGE_MATCHES={exact}")
 print(f"VISUAL_MATCH_PIXEL_MEAN_DIFFERENCE={best:.3f}")
 print("WINDOWS_BRANDED_PE_ICON_VERIFIED=true")

if __name__=="__main__":main()
