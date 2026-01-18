"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Users,
  BarChart3,
  Shield,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import UserMenu from "@/components/shared/user-menu";

export const Hero = () => {
  const router = useRouter();

  const stats = [
    {
      label: "商品管理",
      value: "99.9%",
      subtext: "库存准确率",
      icon: CalendarCheck,
    },
    { label: "订单处理", value: "3x", subtext: "效率提升", icon: TrendingUp },
    { label: "销售分析", value: "实时", subtext: "数据洞察", icon: BarChart3 },
  ];

  const features = [
    {
      icon: Clock,
      title: "商品管理",
      description: "多规格商品、库存管理、价格策略，智能库存预警与补货",
    },
    {
      icon: CalendarCheck,
      title: "订单处理",
      description: "订单全流程跟踪，智能分单配货，一键批量发货",
    },
    {
      icon: Users,
      title: "客户管理",
      description: "会员体系、积分管理、营销活动，提升客户复购率",
    },
    {
      icon: BarChart3,
      title: "数据分析",
      description: "实时销售统计、经营分析报表、自定义数据导出",
    },
  ];

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="container relative px-4 md:px-6 mx-auto pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left Column - Text Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                企业级电商管理平台
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                <span className="text-foreground">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground text-pretty leading-relaxed max-w-xl">
                为商家打造的一站式电商管理平台，让数据驱动每一个经营决策
              </p>
            </div>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              整合商品管理、订单处理、库存管理、客户运营与数据分析，帮助商家建立高效的电商运营体系，降低运营成本，提升销售业绩。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size={"lg"} onClick={() => router.push("/products")}>
                进入管理端
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <UserMenu size={"lg"} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="space-y-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-4 w-4 text-primary" />
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.subtext}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-border shadow-2xl">
              <Image
                src="/images/shopping-mall.png"
                alt="商城管理系统演示"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-tr from-background/80 via-background/20 to-transparent" />

              {/* Floating Stats Card */}
              <motion.div
                className="absolute bottom-2 left-2 right-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="p-2 bg-card/95 backdrop-blur-sm border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {process.env.NEXT_PUBLIC_APP_NAME}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        专业电商解决方案提供商
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              核心功能
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              覆盖电商运营全场景，助力商家业务增长
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow border-border bg-card">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
