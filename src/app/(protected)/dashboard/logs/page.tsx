import { Activity, Calendar } from "lucide-react";

import Breadcrumb from "@/components/dashboard/Breadcrumb";
import LogsComponent from "@/components/dashboard/LogsComponent";
import RecentActivityComponent from "@/components/dashboard/RecentActivity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LogsPage() {
  return (
    <div className="p-6">
      <Breadcrumb
        title="Logs do Sistema"
        description="Página de logs em desenvolvimento. Funcionalidade completa em breve."
        icon={<Activity className="w-6 h-6 mr-2 text-verde-suave" />}
        goToHome={true}
      />

      <Tabs defaultValue="events" className="p-4">
        <TabsList className="bg-transparent">
          <TabsTrigger value="system">
            <Activity className="w-4 h-4 mr-2" />
            Logs do Sistema
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="w-4 h-4 mr-2" />
            Logs de Eventos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="system">
          <LogsComponent visible={true} className="mb-8" />
        </TabsContent>
        <TabsContent value="events">
          <RecentActivityComponent className="mb-8" visible={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
