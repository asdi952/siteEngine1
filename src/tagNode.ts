import { DomNode } from "./domNOde"
import { RouteNode } from "./routerNode"

const allTags = new Set<string>(["div", "p","span","html","body"])
const allCustomTags = new Map<string, CustomTagNode>()

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
class CustomTagNode{
    domNode: DomNode = new DomNode(this)
    tag:string
    constructor(tag: string){
        this.tag = tag
        allCustomTags.set(tag, this)
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

const root:{route: RouteNode}={ route: RouteNode.create("/")}

export{
    DomNode,
    TagNode,
    TextNode,
    root
}