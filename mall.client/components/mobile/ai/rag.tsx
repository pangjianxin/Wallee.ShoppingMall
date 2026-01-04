import { Book, Shield, Globe, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const roadmap = [
  {
    title: "阶段一 · 知识采集",
    desc: "梳理权威资料与内部文档，统一清洗、分块与向量化。",
    eta: "预计 12 月",
  },
  {
    title: "阶段二 · 检索问答",
    desc: "接入语义检索与重排序，支持多轮追问与引用来源。",
    eta: "预计 1 月",
  },
  {
    title: "阶段三 · 实时反馈",
    desc: "结合业务事件流，提供最新背景与风控提示。",
    eta: "预计 2 月",
  },
];

const visions = [
  {
    title: "可信语义检索",
    desc: "基于业务本体构建索引，回答附带来源脚注，便于复核。",
    icon: Book,
  },
  {
    title: "场景化洞察",
    desc: "将组织架构、权限与监控信号合并，给出针对性的行动建议。",
    icon: Shield,
  },
  {
    title: "多模态扩展",
    desc: "未来将逐步接入图谱、地理以及多语言知识库，覆盖更多终端。",
    icon: Globe,
  },
];

export default function RagShowcase() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1">
        <section className="px-4 py-16 md:py-24 bg-linear-to-b from-muted/40 to-background border-b">
          <div className="container max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4" />
              RAG 模块开发中
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              企业级 RAG 智能检索，敬请期待
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              我们正在打磨一套覆盖知识采集、语义检索到行动建议的完整链路，让智能助手真正理解你的业务语境。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg">申请内测</Button>
              <Button size="lg" variant="outline" className="bg-transparent">
                订阅进展 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="container max-w-4xl mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">研发路线图</h2>
              <p className="text-muted-foreground text-sm">
                每个阶段都会开放小范围用户验证，确保体验扎实可靠。
              </p>
            </div>
            <Card className="border-dashed">
              <CardContent className="p-6 grid gap-6">
                {roadmap.map((item, index) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-2 border-l-2 border-border pl-4"
                  >
                    <div className="text-xs uppercase text-muted-foreground tracking-widest">
                      {item.eta}
                    </div>
                    <p className="text-lg font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    {index < roadmap.length - 1 && (
                      <Separator className="opacity-50" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="container max-w-5xl mx-auto space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">我们对 RAG 的期待</h2>
              <p className="text-muted-foreground text-sm">
                不止于“问答”，而是围绕组织协作打造一个可信的知识运行时。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {visions.map((vision) => (
                <Card key={vision.title} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-primary">
                      <vision.icon className="h-5 w-5" />
                      <CardTitle className="text-base">{vision.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {vision.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/20">
        <div className="container px-4 py-8 mx-auto text-center space-y-3 text-sm text-muted-foreground">
          <p>RAG 功能仍在迭代中，欢迎反馈你的业务场景。</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              提交需求
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              预约演示
            </Button>
          </div>
          <p>© {currentYear} 包头分行金融科技中心 AI</p>
        </div>
      </footer>
    </div>
  );
}
