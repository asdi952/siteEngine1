
class BranchRender{
    text:string = ""


    render():string{
        return this.text
    }
}

class Branch{
    prevBranch: Branch|null = null
    nextBranches: Branch[] = []
    route: RouteDomNode|null = null
    router: RouterDomNode|null = null

    branchIndex:number = -1
    isRooted:boolean = false

    static create(){
        return new Branch()
    }
    constructor(){}
    addBranch(branch:Branch){   
        this.nextBranches.push(branch)
        branch.prevBranch = this
        this.rootify(branch)
    }
    rootify(branch:Branch){
        if(this.isRooted == false) return
        branch.isRooted = true
        branch.branchIndex = this.branchIndex + 1
        branch.nextBranches.forEach((elm:Branch)=>{
            branch.rootify(elm)
        })
    }
    setRoute(route:RouteDomNode){
        this.route = route
        route.branch = this
    }   
    setRouter(router:RouterDomNode){
        this.router = router
        router.branch = this
    }
    setOther(other: TagDomNode|TextDomNode){
        other.branch = this
    }

    toString():string{
        return `Branch --: Route: ${this.route?.path} Router:${this.router != null} branchIndex:${this.branchIndex} isRooted:${this.isRooted}`
    }
    
}
class DomNode{
    childs: DomNode[] = []
    parent: DomNode|null = null
    host: DomNodeType

    constructor(host:DomNodeType){
        this.host = host
    }
    addChild(node:DomNode){
        this.childs.push(node)
        node.parent = this
    }
    
}
type DomNodeType = RouterDomNode|RouteDomNode|TagDomNode|TextDomNode
enum DomNodeEnum{RouterDomNode,RouteDomNode,TagDomNode,TextDomNode}

class RouterDomNode{
    readonly type:DomNodeEnum = DomNodeEnum.RouterDomNode
    domNode: DomNode = new DomNode(this)
    branch: Branch|null = null

    static create(){
        return new RouterDomNode()
    }
    addRoute(node: RouteDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.addBranch(node.branch)
    }
    branchfy(){
        if(this.branch == null) return
        this.domNode.childs.forEach((elm:DomNode)=>{
            const route = elm.host as RouteDomNode
            this.branch!.addBranch(route.branch)
        })
    }
    toString():string{
        return "Router"
    }
}
class RouteDomNode{
    readonly type:DomNodeEnum = DomNodeEnum.RouteDomNode
    domNode: DomNode = new DomNode(this)
    path:string
    branch: Branch = Branch.create()

    
    static create(path:string):RouteDomNode{
        const route = new RouteDomNode(path)
        route.branch.setRoute(route)
        return route
    }
    setAsRoot(){
        this.branch.branchIndex = 0
        this.branch.isRooted = true
    }
    constructor(path:string){
        this.path = path
    }
    addRouter(node: RouterDomNode){
        this.domNode.addChild(node.domNode)
        this.branch.setRouter(node)
        node.branchfy()
        
    }
    addTag(node:TagDomNode){
        this.domNode.addChild(node.domNode)
        this.branch.setOther(node)
        node.branchfy()
    }
    addText(node:TextDomNode){
        this.domNode.addChild(node.domNode)
        this.branch.setOther(node)
        node.branchfy()
    }
    branchfy(){
        if(this.branch == null)return

        this.domNode.childs.forEach((elm:DomNode)=>{
            switch(elm.host.type){
                case DomNodeEnum.RouterDomNode:
                    this.branch.setRouter(elm.host as RouterDomNode)
                    break
                case DomNodeEnum.TagDomNode:
                    this.branch.setOther(elm.host as TagDomNode)
                    break
                case DomNodeEnum.TextDomNode:
                    this.branch.setOther(elm.host as TextDomNode)
                    break
            }
            elm.host.branchfy()
        })
    }
    toString():string{
        return "Route: " + this.path
    }
}
class TagDomNode{
    readonly type:DomNodeEnum = DomNodeEnum.TagDomNode
    domNode: DomNode = new DomNode(this)
    tag:string
    branch: Branch|null = null

    static create(tag:string){
        return new TagDomNode(tag)
    }
    constructor(tag:string){
        this.tag = tag
    }
    branchfy(){
        if(this.branch == null)return
    
        this.domNode.childs.forEach((elm:DomNode)=>{
            switch(elm.host.type){
                case DomNodeEnum.RouterDomNode:
                    this.branch!.setRouter(elm.host as RouterDomNode)
                    elm.host.branchfy()
                    break
                case DomNodeEnum.TagDomNode:
                    this.branch!.setOther(elm.host as TagDomNode)
                    elm.host.branchfy()
                    break
                case DomNodeEnum.TextDomNode:
                    this.branch!.setOther(elm.host as TextDomNode)
                    elm.host.branchfy()
                    break
                case DomNodeEnum.RouteDomNode:
                    const route = elm.host as RouteDomNode
                    this.branch!.addBranch(route.branch)
                    break
            }
        })
    }
    addRouter(node:RouterDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.setRouter(node)
        node.branchfy()
    }
    addRoute(node:RouteDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.setRoute(node)
        node.branchfy()
    }
    addTag(node:TagDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.setOther(node)
        node.branchfy()
    }
    addText(node:TextDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.setOther(node)
        node.branchfy()
    }
    toString():string{
        return "Tag: " + this.tag
    }
}
class TextDomNode{
    readonly type:DomNodeEnum = DomNodeEnum.TextDomNode
    domNode: DomNode = new DomNode(this)
    branch: Branch|null = null
    text:string = ""

    branchfy(){
        if(this.branch == null)return
    
        this.domNode.childs.forEach((elm:DomNode)=>{
            switch(elm.host.type){
                case DomNodeEnum.RouterDomNode:
                    this.branch!.setRouter(elm.host as RouterDomNode)
                    elm.host.branchfy()
                    break
                case DomNodeEnum.TagDomNode:
                    this.branch!.setOther(elm.host as TagDomNode)
                    elm.host.branchfy()
                    break
                case DomNodeEnum.TextDomNode:
                    this.branch!.setOther(elm.host as TextDomNode)
                    elm.host.branchfy()
                    break
                case DomNodeEnum.RouteDomNode:
                    const route = elm.host as RouteDomNode
                    this.branch!.addBranch(route.branch)
                    break
            }
        })
    }

    addRouter(node:RouterDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.setRouter(node)
        node.branchfy()
    }
    addRoute(node:RouteDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.setRoute(node)
        node.branchfy()
    }
    addTag(node:TagDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.setOther(node)
        node.branchfy()
    }
    addText(node:TextDomNode){
        this.domNode.addChild(node.domNode)
        this.branch?.setOther(node)
        node.branchfy()
    }
    toString():string{
        return "Text"
    }
    render():string{
        return ""
    }
}

class Root{
    route:RouteDomNode 
    constructor(path:string){
        this.route = RouteDomNode.create(path)
        this.route.setAsRoot()
    }
}
const root:Root = new Root("")

function printDomNodes( node: DomNodeType){
    interface Holder{node: DomNodeType, childIndex:number}
    let curHolder:Holder = {node:node, childIndex: 0}
    const stackHolder:Holder[] = []
    console.log("Print DomNode --:")
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

function printBranches(branch: Branch){
    interface Holder{branch:Branch, childIndex:number}
    const stackHolder:Holder[] = []
    let curHolder:Holder = {branch: branch, childIndex:0}

    console.log("Print Branches --:")
    while(1){
        if(curHolder.childIndex == 0){
            let tabs=""
            for(let i=0;i<stackHolder.length;i++){tabs+="\t"}
            console.log(tabs + " " + curHolder.branch.toString())
        }
        if(curHolder.childIndex < curHolder.branch.nextBranches.length){
            const branch = curHolder.branch.nextBranches[curHolder.childIndex]
            curHolder.childIndex++
            stackHolder.push(curHolder)
            curHolder = {branch:branch, childIndex:0}
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

    const div0 = TagDomNode.create("div")
    const div1 = TagDomNode.create("div")
    const div2 = TagDomNode.create("div")
    div0.addTag(div1)

    route0.addTag(div0)
    route1.addTag(div2)

    const router1 = RouterDomNode.create()
    const div3 = TagDomNode.create("span")
    const route2 = RouteDomNode.create("coco")
    router1.addRoute(route2)
    route2.addTag(div3)
    div0.addRouter(router1) 


    printDomNodes(root.route)
    printBranches(root.route.branch)
}
test()

export{
    type DomNodeType,
    TagDomNode,
    TextDomNode,
    RouteDomNode,
    RouterDomNode,
    Branch,
}
