import { RouteNode, RouterNode, TagNode, root } from "./tagNode";


class PageChunk{
    text:string = ""
    startRoute: RouteNode|null = null
    endRoute: RouteNode|null = null
}

function test(){
    const div0 = TagNode.create("div")
    const div1 = TagNode.create("div")
    const div2 = TagNode.create("div")
    div1.addDomNode(div2.getDomNode())

    const route0 = RouteNode.create("/home")
    const route1 = RouteNode.create("/about")
    route0.addDomNode(div0.getDomNode())
    route0.addDomNode(div1.getDomNode())


    const router0 = RouterNode.create()
    router0.addRoute(route0)
    router0.addRoute(route1)

    root.node = router0.getDomNode()
}
test()