
namespace test2{

    class Branch{
        route: RouteDomNode|null = null
        router: RouterDomNode|null = null
        prevBranch: Branch|null = null
        nextBranches: Branch[] = []

        static create(){
            return new Branch()
        }
        constructor(){}
        addBranchRec(branch:Branch){   
            this.nextBranches.push(branch)
            branch.prevBranch = this
            this.nextBranches.forEach((elm:Branch)=>{
                elm.
            })
        }
        addRoute(route:RouteDomNode){
            this.route = route
            route.domNode.branch = this
        }   
        addRouter(router:RouterDomNode){
            this.router = router
            router.domNode.branch = this
        }
        
    }
    class DomNode{
        childs: DomNode[] = []
        parent: DomNode|null = null
        host: DomNodeType
        branch: Branch|null = null

        constructor(host:DomNodeType){
            this.host = host
        }
        addChild(node:DomNode){
            this.childs.push(node)
            node.parent = this
        }
        propagateBranch(node:DomNode){
            if(this.branch == null) return
            if(RouteDomNode.checkType(node.host)){
                this.branch.addBranchRec()
            }else if(RouterDomNode.checkType(node.host)){

            }else{

            }
        }
    }
    type DomNodeType = RouterDomNode|RouteDomNode|TagDomNode|TextDomNode

    class RouterDomNode{
        domNode: DomNode = new DomNode(this)

        static create(){
            return new RouterDomNode()
        }
        static checkType(type:any):boolean{
            return (type instanceof RouteDomNode)
        }
        addRoute(node: RouteDomNode){
            this.domNode.addChild(node.domNode)
        }
        toString():string{
            return "Router"
        }
    }
    class RouteDomNode{
        domNode: DomNode = new DomNode(this)
        path:string

        static checkType(type:any):boolean{
            return (type instanceof RouteDomNode)
        }
        static create(path:string){
            const route:RouteDomNode = new RouteDomNode(path)
            const branch:Branch = Branch.create()
            branch.addRoute(route)
            return route
        }
        constructor(path:string){
            this.path = path
        }
        addRouter(node: RouterDomNode){
            this.domNode.addChild(node.domNode)
            this.domNode.branch!.router = node
        }
        addTag(node:TagDomNode){
            this.domNode.addChild(node.domNode)
        }
        addText(node:TextDomNode){
            this.domNode.addChild(node.domNode)
        }
        toString():string{
            return "Route: " + this.path
        }
    }
    class TagDomNode{
        domNode: DomNode = new DomNode(this)
        tag:string

        static create(tag:string){
            return new TagDomNode(tag)
        }
        constructor(tag:string){
            this.tag = tag
        }
        toString():string{
            return "Tag: " + this.tag
        }
    }
    class TextDomNode{
        domNode: DomNode = new DomNode(this)
        toString():string{
            return "Text"
        }
    }

    const root:{route:RouteDomNode} = {route:RouteDomNode.create("")}

    function printDomNodes( node: DomNodeType){
        interface Holder{node: DomNodeType, childIndex:number}
        let curHolder:Holder = {node:node, childIndex: 0}
        const stackHolder:Holder[] = []
        while(1){
            if(curHolder.childIndex == 0){
                let tabs=""
                for(let i=0;i <stackHolder.length;i++){tabs+="\t"}
                console.log(tabs + " " + curHolder.node.toString())
            }
            if(curHolder.childIndex < curHolder.node.domNode.childs.length){
                let node:DomNodeType = curHolder.node.domNode.childs[curHolder.childIndex].host
                curHolder.childIndex++
                stackHolder.push(curHolder)
                curHolder = {node: node, childIndex: 0}
            }else{
                const holder:Holder|undefined = stackHolder.pop()
                if(holder === undefined){
                    break
                }
                curHolder = holder
            }
        }
    }


    function test(){

        const router0 = RouterDomNode.create()

        const route0 = RouteDomNode.create("home")
        const route1 = RouteDomNode.create("about")

        router0.addRoute(route0)
        router0.addRoute(route1)

        root.route.addRouter(router0)

        printDomNodes(root.route)
    }
    test()
}