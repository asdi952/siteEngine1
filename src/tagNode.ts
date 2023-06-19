

class DomNode{
    childs: DomNode[] = []
    parent: DomNode|null = null
    host: any
    constructor(host: any){
        this.host = host
    }
    add(node: DomNode){
        this.childs.push(node)
        node.parent = this
    }

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
    constructor(path: string){
        this.path = path
    }
    static create(path: string){
        return new RouteNode(path)
    }
    getDomNode(){return this.domNode}
    addDomNode(node: DomNode){
        this.domNode.add( node)
    }
}
class TagNode{
    private domNode: DomNode = new DomNode(this)
    tag:string
    constructor( tag: string){
        this.tag = tag
    }
    static create(tag:string){
        return new TagNode(tag)
    }
    getDomNode(){return this.domNode}
    addDomNode(node: DomNode){
        this.domNode.add( node)
    }
}
class TextNode{
    private domNode: DomNode = new DomNode(this)

    static create(){
        return new TextNode()
    }
    getDomNode(){return this.domNode}
    addDomNode(node: DomNode){
        this.domNode.add( node)
    }
}

const root:{node?:DomNode}={}

export{
    RouterNode,
    RouteNode,
    TagNode,
    TextNode,
    root
}