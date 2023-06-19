import { DomNode } from "./domNOde"


class RouteChunk{
    text:string = ""
    startRoute: RouteNode|null = null
    endRouter: RouterNode|null = null
}

class RouterNode{
    private domNode: DomNode = new DomNode(this)

    static create(){
        return new RouterNode()
    }
    addRoute( route: RouteNode){
        this.domNode.add(route.getDomNode())
    }
    getDomNode(){return this.domNode}
}
class RouteNode{
    private domNode: DomNode = new DomNode(this)
    path: string
    nextRouters: RouterNode[] = [] 
    prevRoute: RouteNode|null = null

    constructor(path: string){
        this.path = path
    }
    static create(path: string){
        return new RouteNode(path)
    }
    getDomNode(){return this.domNode}
    addDomNode(node: DomNode){
        this.domNode.addFromRoute( node,this)
    }
    getRouter(): RouterNode{return this.domNode.host as RouterNode}
}

export{
    RouteNode,
    RouterNode,
}