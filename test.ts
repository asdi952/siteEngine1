class DomTreeNode{
    childs: DomTreeNode[] = []
    parent: DomTreeNode|null = null
    host: any
    route: RouteNode|null = null

    constructor(host: any){
        this.host = host
    }
    add(node: DomTreeNode){
        this.childs.push(node)
        node.parent = this
        node.route = this.route
    }
    addFromRoute(node:DomTreeNode, route: RouteNode){
        this.childs.push(node)
        node.parent = this
        this.route = route
    }
}

enum NodeType{RouterNode, RouteNode, CustomTagNode, TagNode, TextNode}
class RouterNode{   
    readonly type: NodeType = NodeType.RouterNode
    private domNode: DomTreeNode = new DomTreeNode(this)

    static create(){
        return new RouterNode()
    }
    addRouteNode(node: RouteNode){
        this.domNode.add(node.getDomNode())
    }
    
    getDomNode():DomTreeNode {return this.domNode}

}

class RouteNode{
    readonly type: NodeType = NodeType.RouteNode
    private domNode: DomTreeNode = new DomTreeNode(this)
    path:string

    constructor(path:string){
        this.path = path
    }
    static create(path:string){
        return new RouteNode(path)
    }
    addTagNode(node: TagNode){
        this.domNode.addFromRoute(node.getDomNode(), this)
    }
    addRouterNode(node: RouterNode){
        this.domNode.addFromRoute(node.getDomNode(), this)
    }
    addCustomTagNode(node: CustomTagNode){
        this.domNode.addFromRoute(node.getDomNode(), this)
    }
    addTextNode(node: TextNode){
        node.route = this.domNode.route
        node.parent = this.domNode
    }

    getDomNode():DomTreeNode {return this.domNode}

}
class CustomTagNode{
    readonly type: NodeType = NodeType.CustomTagNode
    private domNode: DomTreeNode = new DomTreeNode(this)
    tag:string
    
    constructor(tag:string){
        this.tag = tag
    }
    static create(tag:string){
        return new CustomTagNode(tag)
    }
    addTagNode(node: TagNode){
        this.domNode.add(node.getDomNode())
    }
    addRouterNode(node: RouterNode){
        this.domNode.add(node.getDomNode())
    }
    addRouteNode(node: RouteNode){
        this.domNode.add(node.getDomNode())
    }
    addCustomTagNode(node: CustomTagNode){
        this.domNode.add(node.getDomNode())
    }
    addTextNode(node: TextNode){
        node.parent = this.domNode
    }
    
    getDomNode():DomTreeNode {return this.domNode}
}
class TagNode{
    readonly type: NodeType = NodeType.TagNode
    private domNode: DomTreeNode = new DomTreeNode(this)
    tag: string

    constructor(tag:string){
        this.tag = tag
    }
    static create(tag:string){
        return new TagNode(tag)
    }
    addTagNode(node: TagNode){
        this.domNode.add(node.getDomNode())
    }
    addRouterNode(node: RouterNode){
        this.domNode.add(node.getDomNode())
    }
    addRouteNode(node: RouteNode){
        this.domNode.add(node.getDomNode())
    }
    addCustomTagNode(node: CustomTagNode){
        this.domNode.add(node.getDomNode())
    }
    addTextNode(node: TextNode){
        node.parent = this.domNode
    }

    getDomNode():DomTreeNode {return this.domNode}
}
class TextNode{
    parent: DomTreeNode|null = null
    route: RouteNode|null = null
    readonly type: NodeType = NodeType.TextNode
    
    static create(){
        return new TextNode()
    }
}

const root:{node:RouteNode} = {node: RouteNode.create("/")}

function test(){
    const div0 = TagNode.create("div")
    const div1 = TagNode.create("div")
    const div2 = TagNode.create("div")

    const route0 = RouteNode.create("/home")
    const route1 = RouteNode.create("/about")

    const router0 = RouterNode.create()

    root.node.addRouterNode(router0)
    router0.addRouteNode(route0)
    router0.addRouteNode(route1)
    route0.addTagNode(div0)
    route1.addTagNode(div1)
    div1.addTagNode(div2)

}
test()