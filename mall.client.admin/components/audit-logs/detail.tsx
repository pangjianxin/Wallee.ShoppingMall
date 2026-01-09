"use client";
import { WalleeMallAuditLogsDtosAuditLogDto } from "@/openapi";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { formatJSON } from "@/lib/utils";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  auditLog: WalleeMallAuditLogsDtosAuditLogDto;
};

const AuditLogDetail: FC<Props> = ({ auditLog }) => {
  const [open, setOpen] = useState(true);

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.back();
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-[600px] h-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>审计日志明细</DialogTitle>
          <DialogDescription>审计日志明细</DialogDescription>
        </DialogHeader>
        <Accordion
          type="multiple"
          defaultValue={["general-info", "entity-changes", "actions"]}
          className="w-full"
        >
          <AccordionItem value="general-info">
            <AccordionTrigger>
              <span className="text-base font-semibold">概况信息</span>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableBody>
                  {Object.entries(auditLog).map(([key, value]) => {
                    if (typeof value !== "object" && value !== null) {
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-light text-sm">
                            {key}
                          </TableCell>
                          <TableCell className="font-light text-gray-500">
                            {String(value)}
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          {auditLog.entityChanges && auditLog.entityChanges.length > 0 && (
            <AccordionItem value="entity-changes">
              <AccordionTrigger>实体变更</AccordionTrigger>
              <AccordionContent>
                <Accordion
                  type="multiple"
                  defaultValue={
                    auditLog.entityChanges?.map(
                      (_, index) => `entity-change-${index}`
                    ) || []
                  }
                  className="w-full"
                >
                  {auditLog.entityChanges.map((change, index) => (
                    <AccordionItem
                      key={change.id}
                      value={`entity-change-${index}`}
                    >
                      <AccordionTrigger>实体变更{index + 1}</AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableBody>
                            {Object.entries(change).map(([key, value]) => {
                              if (
                                key !== "propertyChanges" &&
                                typeof value !== "object"
                              ) {
                                return (
                                  <TableRow key={key}>
                                    <TableCell className="font-medium">
                                      {key}
                                    </TableCell>
                                    <TableCell>{String(value)}</TableCell>
                                  </TableRow>
                                );
                              }
                              return null;
                            })}
                          </TableBody>
                        </Table>
                        {change.propertyChanges &&
                          change.propertyChanges.length > 0 && (
                            <Accordion
                              type="multiple"
                              defaultValue={["property-changes"]}
                              className="w-full mt-4"
                            >
                              <AccordionItem value="property-changes">
                                <AccordionTrigger>属性变更</AccordionTrigger>
                                <AccordionContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>属性名称</TableHead>
                                        <TableHead>原值</TableHead>
                                        <TableHead>新值</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {change.propertyChanges.map(
                                        (propChange) => (
                                          <TableRow key={propChange.id}>
                                            <TableCell>
                                              {propChange.propertyName}
                                            </TableCell>
                                            <TableCell>
                                              {propChange.originalValue}
                                            </TableCell>
                                            <TableCell>
                                              {propChange.newValue}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          )}

          {auditLog.actions && auditLog.actions.length > 0 && (
            <AccordionItem value="actions">
              <AccordionTrigger>
                <span className="text-base font-semibold">动作</span>
              </AccordionTrigger>
              <AccordionContent>
                <Accordion
                  type="multiple"
                  defaultValue={
                    auditLog.actions?.map((_, index) => `action-${index}`) || []
                  }
                  className="w-full"
                >
                  {auditLog.actions.map((action, index) => (
                    <AccordionItem key={action.id} value={`action-${index}`}>
                      <AccordionTrigger>
                        <span className="text-sm font-semibold">
                          动作 {index + 1}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableBody>
                            {Object.entries(action).map(([key, value]) => {
                              if (typeof value !== "object") {
                                return (
                                  <TableRow key={key}>
                                    <TableCell className="font-light text-sm">
                                      {key}
                                    </TableCell>
                                    <TableCell className="font-light text-gray-500">
                                      {key === "parameters" ? (
                                        <pre className="whitespace-pre-wrap overflow-x-auto">
                                          <code>
                                            {formatJSON(value as string)}
                                          </code>
                                        </pre>
                                      ) : (
                                        String(value)
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                              return null;
                            })}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"}>关闭</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuditLogDetail;
