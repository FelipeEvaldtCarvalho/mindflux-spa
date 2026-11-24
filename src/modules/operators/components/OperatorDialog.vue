<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import SelectButton from "primevue/selectbutton";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import type { Operator, OperatorPayload } from "../services/operators.service";

const props = defineProps<{
  visible: boolean;
  operator: Operator | null; // null = novo operador
  saving: boolean;
  isSelf: boolean; // o admin editando a própria conta
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  save: [payload: OperatorPayload];
}>();

const MIN_PASSWORD = 8;
const roleOptions = [
  { label: "Operador", value: "operator" },
  { label: "Administrador", value: "admin" },
];

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "operator" as Operator["role"],
  isActive: true,
});
const touched = reactive({ email: false, password: false });

const isNew = computed(() => !props.operator);

watch(
  () => props.visible,
  (open) => {
    if (!open) return;
    form.name = props.operator?.name ?? "";
    form.email = props.operator?.email ?? "";
    form.password = "";
    form.role = props.operator?.role ?? "operator";
    form.isActive = props.operator?.isActive ?? true;
    touched.email = false;
    touched.password = false;
  }
);

const emailError = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? "" : "Informe um e-mail válido"
);
const passwordError = computed(() => {
  if (!isNew.value && !form.password) return ""; // na edição, vazio = manter senha
  return form.password.length >= MIN_PASSWORD
    ? ""
    : `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres`;
});
const isValid = computed(() => !emailError.value && !passwordError.value);

const submit = () => {
  touched.email = true;
  touched.password = true;
  if (!isValid.value) return;

  const payload: OperatorPayload = {
    name: form.name.trim(),
    email: form.email.trim(),
    role: form.role,
  };
  if (form.password) payload.password = form.password;
  if (!isNew.value) payload.isActive = form.isActive;
  emit("save", payload);
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="(v) => emit('update:visible', v)"
    modal
    :header="isNew ? 'Novo operador' : 'Editar operador'"
    :style="{ width: 'min(32rem, 94vw)' }"
    :draggable="false"
  >
    <form class="grid gap-5 pt-2" @submit.prevent="submit">
      <div class="grid gap-1">
        <label for="op-name" class="font-medium">Nome</label>
        <InputText id="op-name" v-model="form.name" autocomplete="off" fluid />
      </div>

      <div class="grid gap-1">
        <label for="op-email" class="font-medium">E-mail (login)</label>
        <InputText
          id="op-email"
          v-model="form.email"
          type="email"
          inputmode="email"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          :invalid="touched.email && !!emailError"
          @blur="touched.email = true"
          fluid
        />
        <small v-if="touched.email && emailError" class="text-red-600">{{ emailError }}</small>
      </div>

      <div class="grid gap-1">
        <label for="op-password" class="font-medium">
          {{ isNew ? "Senha inicial" : "Nova senha" }}
        </label>
        <Password
          inputId="op-password"
          v-model="form.password"
          :feedback="false"
          toggleMask
          :inputProps="{ autocomplete: 'new-password' }"
          :invalid="touched.password && !!passwordError"
          @blur="touched.password = true"
          fluid
        />
        <small v-if="touched.password && passwordError" class="text-red-600">
          {{ passwordError }}
        </small>
        <small v-else class="text-surface-500">
          {{
            isNew
              ? `Mínimo de ${MIN_PASSWORD} caracteres. Passe a senha para o operador.`
              : "Deixe em branco para manter a senha atual."
          }}
        </small>
      </div>

      <div class="grid gap-2">
        <span class="font-medium">Perfil</span>
        <SelectButton
          v-model="form.role"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          :allowEmpty="false"
          :disabled="isSelf"
        />
        <small class="text-surface-500">
          Administradores também cadastram e gerenciam operadores.
        </small>
      </div>

      <div v-if="!isNew" class="flex items-center justify-between gap-4">
        <div>
          <p class="font-medium">Acesso ativo</p>
          <small class="text-surface-500">Desativado não consegue entrar no sistema.</small>
        </div>
        <ToggleSwitch v-model="form.isActive" :disabled="isSelf" />
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          outlined
          @click="emit('update:visible', false)"
        />
        <Button type="submit" :label="isNew ? 'Cadastrar' : 'Salvar'" :loading="saving" />
      </div>
    </form>
  </Dialog>
</template>
