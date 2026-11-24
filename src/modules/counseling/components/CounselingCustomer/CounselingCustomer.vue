<script lang="ts">
export default {
  name: "CounselingCustomer",
};
</script>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Skeleton from "primevue/skeleton";
import FeedBack from "@/components/FeedBack.vue";
import CounselingCustomerInitialInterview from "./CounselingCustomerInitialInterview.vue";
import CounselingCustomerChronologicalCycles from "./CounselingCustomerChronologicalCycles.vue";
import ChronologicalCyclesList from "./ChronologicalCyclesList.vue";
import { useCounseling } from "@/modules/counseling/hooks/counseling.hook";
import { useChronologicalCycle } from "@/modules/counseling/hooks/chronological-cycle.hook";

const route = useRoute();
const { loading, customerName, notFound, isDirty, load } = useCounseling();
const { setCustomer, loadHistory } = useChronologicalCycle();

const tab = ref("interview");

const loadCustomer = () => {
  const id = Number(route.params.id);
  if (!id) return;
  tab.value = "interview";
  load(id);
  setCustomer(id);
};

watch(() => route.params.id, loadCustomer);
onMounted(loadCustomer);

// O histórico é atualizado sempre que a aba é aberta (antes ficava desatualizado).
watch(tab, (value) => {
  if (value === "history") loadHistory();
});

// Evita perder a entrevista digitada e não salva.
const UNSAVED_MESSAGE = "A entrevista tem alterações não salvas. Sair mesmo assim?";
onBeforeRouteLeave(() => (isDirty.value ? window.confirm(UNSAVED_MESSAGE) : true));
const beforeUnload = (event: BeforeUnloadEvent) => {
  if (isDirty.value) event.preventDefault();
};
window.addEventListener("beforeunload", beforeUnload);
onBeforeUnmount(() => window.removeEventListener("beforeunload", beforeUnload));
</script>
<template>
  <section class="grid gap-6 p-6 lg:p-8 min-w-0">
    <header class="grid gap-1">
      <RouterLink to="/customers" class="text-primary-700 font-medium w-fit">
        ← Clientes
      </RouterLink>
      <Skeleton v-if="loading" height="2rem" width="16rem" />
      <h1 v-else class="page-title">{{ customerName || "Atendimento" }}</h1>
    </header>

    <FeedBack
      v-if="notFound && !loading"
      icon="warning"
      title="Cliente não encontrado"
      description="Ele pode ter sido excluído ou pertencer a outro operador."
    />

    <Tabs v-else v-model:value="tab" scrollable class="min-w-0">
      <TabList>
        <Tab value="interview">Entrevista inicial</Tab>
        <Tab value="cycles">Ciclo cronológico</Tab>
        <Tab value="history">Histórico</Tab>
      </TabList>
      <TabPanels class="!px-0 !pt-6">
        <TabPanel value="interview">
          <CounselingCustomerInitialInterview />
        </TabPanel>
        <TabPanel value="cycles">
          <CounselingCustomerChronologicalCycles />
        </TabPanel>
        <TabPanel value="history">
          <ChronologicalCyclesList />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </section>
</template>
