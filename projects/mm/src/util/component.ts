export class ClassMethod{
    store:any={};
    el:any;
    constructor(){

    }
    replaceClass(key,value){
        if(this.store[key])this.el.nativeElement.classList.remove(this.store[key]);
        this.el.nativeElement.classList.add(this.store[key]=value);
    }
    toggleClass(className,exist){
        if(!exist&&this.store[className]){
            this.el.nativeElement.classList.remove(className)
            this.store[className]=null;
        }
        if(exist&&!this.store[className]){
            this.el.nativeElement.classList.add(className);
            this.store[className]=true;
        }
    }
}