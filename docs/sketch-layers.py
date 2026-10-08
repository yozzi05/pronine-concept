import os, json, numpy as np
from PIL import Image, ImageFilter, ImageDraw
T=os.path.join(os.environ['TEMP'],'pn')
src=os.path.join(T,'live','img','tehnologii-pronine-padel-kak-ustroena-raketka-dlja-padel-tennisa.png')
im=Image.open(src).convert('RGBA'); W,H=im.size
A=im.split()[-1]
b=np.array(A.filter(ImageFilter.GaussianBlur(7)))
m=Image.fromarray(((b>30)*255).astype('uint8')).copy().filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(9))
inv=Image.fromarray(255-np.array(m)).copy(); ImageDraw.floodfill(inv,(0,0),128); M=(np.array(inv)!=128)
# keep only large connected components (drop text, arrowheads, dims)
lab=np.zeros(M.shape,int); comp_sizes={}
Mi=Image.fromarray((M*255).astype('uint8')).copy()
k=0; arr=np.array(Mi)
ys,xs=np.nonzero(arr==255)
keep=np.zeros(M.shape,bool)
work=Mi.copy()
for y,x in zip(ys,xs):
    if work.getpixel((int(x),int(y)))!=255: continue
    k+=1; ImageDraw.floodfill(work,(int(x),int(y)),100)
    reg=(np.array(work)==100); n=reg.sum()
    if n>40000: keep|=reg
    w2=np.array(work); w2[reg]=50; work=Image.fromarray(w2).copy()
print('components',k)
P=json.load(open(os.path.join(T,'sk','poly.json')))
def above(poly):
    img=Image.new('L',(W,H),0); d=ImageDraw.Draw(img)
    pts=[(0,poly[0][1])]+[tuple(p) for p in poly]+[(W,poly[-1][1]),(W,0),(0,0)]
    d.polygon(pts,fill=255); return np.array(img)>0
a1=above(P['P1']); a2=above(P['P2'])
# сузить силуэт до внешней кромки контура (убрать ореол размытия)
keep=np.array(Image.fromarray((keep*255).astype('uint8')).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(3)))>0
yy,xx=np.mgrid[0:H,0:W]
labels_zone=((yy<700)&(xx>=806))|((yy>=700)&(xx>=818))
keep&=~labels_zone
keep&=~((xx>=678)&(xx<=722)&(yy>=105)&(yy<=142))
L1=keep&a1; L2=keep&~a1&a2; BASE=keep&~a2
rgba=np.array(im)
uf=np.array(Image.fromarray((keep*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2)))/255.0
# внутренние разрезы — жёсткие, растушёвка только по внешнему силуэту
grow=np.array(Image.fromarray((keep*255).astype('uint8')).filter(ImageFilter.MaxFilter(5)))>0
ink=rgba[:,:,:3].astype(float); ia=rgba[:,:,3:4].astype(float)/255
paper=ink*ia+255*(1-ia)
def layer(part,name):
    out=np.zeros(rgba.shape,float); out[:,:,:3]=paper; out[:,:,3]=uf*part*255
    o=Image.fromarray(out.clip(0,255).astype('uint8'),'RGBA'); o.save(os.path.join(T,'sk',name+'.png')); return o
l1=layer((grow&a1).astype(float),'L1'); l2=layer((grow&~a1&a2).astype(float),'L2'); base=layer((grow&~a2).astype(float),'BASE')
annarr=rgba.copy().astype(float); annarr[:,:,3]=rgba[:,:,3]*(1-uf)
ann=Image.fromarray(annarr.clip(0,255).astype('uint8'),'RGBA'); ann.save(os.path.join(T,'sk','ANN.png'))
# verification: recomposite final == original over white
bg=Image.new('RGBA',(W,H),(255,255,255,255))
for L in [ann,base,l2,l1]: bg.alpha_composite(L)
orig=Image.new('RGBA',(W,H),(255,255,255,255)); orig.alpha_composite(im)
diff=np.abs(np.array(bg).astype(int)-np.array(orig).astype(int))[:,:,:3]
print('recomposite max diff',diff.max(),'mean',diff.mean(), 'pixels>24:',(diff.max(axis=2)>24).sum())
bg.convert('RGB').save(os.path.join(T,'sk','recomp.png'))
# mask visualization
vis=np.array(orig.convert('RGB')).astype(float)
for mk,col in [(L1,(255,0,0)),(L2,(0,170,0)),(BASE,(0,90,255))]:
    vis[mk]=vis[mk]*0.6+np.array(col)*0.4
Image.fromarray(vis.astype('uint8')).save(os.path.join(T,'sk','layers_vis.png'))
