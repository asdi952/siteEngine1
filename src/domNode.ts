import { RouteNode } from "./routerNode"

class DomNode{
    childs: DomNode[] = []
    parent: DomNode|null = null
    route: RouteNode|null = null
    host: any
    constructor(host: any){
        this.host = host
    }
    add(node: DomNode){
        this.childs.push(node)
        node.parent = this
        node.route = this.route
    }
    addFromRoute(node:DomNode, route: RouteNode){
        this.add(node)
        route = route
    }
}

export{
    DomNode,
}