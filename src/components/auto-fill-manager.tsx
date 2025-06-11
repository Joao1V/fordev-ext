import React from 'react';
import { Button } from '@heroui/react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { FormField } from '@/types/forms';
import { useGenerateCpf } from '@/services/mutations';

interface AutoFillOptionProps {
  label: string;
  getValue: () => string | Promise<string>;
  field: FormField;
  onFill: (field: FormField, value: string) => void;
}

const AutoFillOption: React.FC<AutoFillOptionProps> = ({ label, getValue, field, onFill }) => {
  return (
    <Button
      size="sm"
      onPress={async () => {
        const value = await getValue();
        onFill(field, value);
      }}
      color="primary"
    >
      {label}
    </Button>
  );
};

interface AutoFillManagerProps {
  field: FormField;
  onFill: (field: FormField, value: string) => void;
}

const AutoFillManager: React.FC<AutoFillManagerProps> = ({ field, onFill }) => {
  const onGetCpf = useGenerateCpf();

  // Determina as opções de preenchimento baseado no tipo, label ou placeholder do campo
  const getFieldOptions = () => {
    const fieldType = field.type.toLowerCase();
    const fieldLabel = (field.label || '').toLowerCase();
    const fieldPlaceholder = (field.placeholder || '').toLowerCase();
    const fieldId = (field.id || '').toLowerCase();
    const fieldName = (field.name || '').toLowerCase();

    const options: AutoFillOptionProps[] = [];

    // Verificações para CPF
    if (
      fieldId.includes('cpf') || 
      fieldLabel.includes('cpf') || 
      fieldPlaceholder.includes('cpf')
    ) {
      options.push({
        label: 'Gerar CPF',
        getValue: async () => await onGetCpf.mutateAsync(),
        field,
        onFill
      });
      return options;
    }

    // Verificações para nome
    if (
      fieldType === 'text' && (
        fieldId.includes('nome') ||
        fieldLabel.includes('nome') ||
        fieldPlaceholder.includes('nome') ||
        fieldName.includes('nome') ||
        fieldId.includes('name') ||
        fieldLabel.includes('name') ||
        fieldPlaceholder.includes('name') ||
        fieldName.includes('name')
      )
    ) {
      options.push({
        label: 'Nome',
        getValue: () => faker.person.fullName(),
        field,
        onFill
      });
    }

    // Verificações para telefone
    if (
      fieldType === 'tel' ||
      fieldId.includes('telefone') ||
      fieldId.includes('phone') ||
      fieldLabel.includes('telefone') ||
      fieldLabel.includes('phone') ||
      fieldPlaceholder.includes('telefone') ||
      fieldPlaceholder.includes('phone') ||
      fieldName.includes('telefone') ||
      fieldName.includes('phone')
    ) {
      options.push({
        label: 'Telefone',
        getValue: () => faker.phone.number(),
        field,
        onFill
      });
    }

    // Verificações para email
    if (
      fieldType === 'email' ||
      fieldId.includes('email') ||
      fieldLabel.includes('email') ||
      fieldPlaceholder.includes('email') ||
      fieldName.includes('email')
    ) {
      options.push({
        label: 'Email',
        getValue: () => faker.internet.email(),
        field,
        onFill
      });
    }

    // Verificações para data de nascimento
    if (
      fieldType === 'date' ||
      fieldId.includes('nascimento') ||
      fieldId.includes('birth') ||
      fieldLabel.includes('nascimento') ||
      fieldLabel.includes('birth') ||
      fieldPlaceholder.includes('nascimento') ||
      fieldPlaceholder.includes('birth') ||
      fieldName.includes('nascimento') ||
      fieldName.includes('birth')
    ) {
      options.push({
        label: 'Data Nascimento',
        getValue: () => faker.date.birthdate().toLocaleDateString('pt-BR'),
        field,
        onFill
      });
    }

    // Verificações para senha
    if (
      fieldType === 'password' ||
      fieldId.includes('senha') ||
      fieldId.includes('password') ||
      fieldLabel.includes('senha') ||
      fieldLabel.includes('password') ||
      fieldPlaceholder.includes('senha') ||
      fieldPlaceholder.includes('password') ||
      fieldName.includes('senha') ||
      fieldName.includes('password')
    ) {
      options.push({
        label: 'Senha 1q2w3e4r',
        getValue: () => '1q2w3e4r',
        field,
        onFill
      });
    }

    // Verificações para endereço
    if (
      fieldId.includes('endereco') ||
      fieldId.includes('address') ||
      fieldLabel.includes('endereco') ||
      fieldLabel.includes('address') ||
      fieldPlaceholder.includes('endereco') ||
      fieldPlaceholder.includes('address') ||
      fieldName.includes('endereco') ||
      fieldName.includes('address')
    ) {
      options.push({
        label: 'Endereço',
        getValue: () => faker.location.streetAddress(),
        field,
        onFill
      });
    }

    // Verificações para cidade
    if (
      fieldId.includes('cidade') ||
      fieldId.includes('city') ||
      fieldLabel.includes('cidade') ||
      fieldLabel.includes('city') ||
      fieldPlaceholder.includes('cidade') ||
      fieldPlaceholder.includes('city') ||
      fieldName.includes('cidade') ||
      fieldName.includes('city')
    ) {
      options.push({
        label: 'Cidade',
        getValue: () => faker.location.city(),
        field,
        onFill
      });
    }

    // Verificações para estado
    if (
      fieldId.includes('estado') ||
      fieldId.includes('state') ||
      fieldLabel.includes('estado') ||
      fieldLabel.includes('state') ||
      fieldPlaceholder.includes('estado') ||
      fieldPlaceholder.includes('state') ||
      fieldName.includes('estado') ||
      fieldName.includes('state')
    ) {
      options.push({
        label: 'Estado',
        getValue: () => faker.location.state(),
        field,
        onFill
      });
    }

    // Verificações para CEP
    if (
      fieldId.includes('cep') ||
      fieldId.includes('zip') ||
      fieldLabel.includes('cep') ||
      fieldLabel.includes('zip') ||
      fieldPlaceholder.includes('cep') ||
      fieldPlaceholder.includes('zip') ||
      fieldName.includes('cep') ||
      fieldName.includes('zip')
    ) {
      options.push({
        label: 'CEP',
        getValue: () => faker.location.zipCode('#####-###'),
        field,
        onFill
      });
    }

    // Se não tivermos uma opção específica, mas for um campo de texto, ofereça algumas opções genéricas
    if (fieldType === 'text' && options.length === 0) {
      options.push({
        label: 'Texto Aleatório',
        getValue: () => faker.lorem.sentence(),
        field,
        onFill
      });
    }

    // Se for um campo numérico
    if (fieldType === 'number') {
      options.push({
        label: 'Número',
        getValue: () => String(faker.number.int({ min: 1, max: 100 })),
        field,
        onFill
      });
    }

    // Verificações para estado (UF)
    if (
      field.label.toLowerCase().includes('estado') ||
      field.label.toLowerCase().includes('uf') ||
      field.id.toLowerCase().includes('estado') ||
      field.id.toLowerCase().includes('uf') ||
      field.placeholder?.toLowerCase().includes('estado') ||
      field.name?.toLowerCase().includes('estado')
    ) {
      options.push({
        label: 'UF Aleatório',
        getValue: () => {
          const states = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
            'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
            'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
          ];
          const randomState = states[Math.floor(Math.random() * states.length)];
          return randomState;
        },
        field,
        onFill
      });
    }

    // Se não houver opções específicas, adicione uma opção genérica
    if (options.length === 0) {
      options.push({
        label: 'Preencher',
        getValue: () => faker.lorem.word(),
        field,
        onFill
      });
    }

    return options;
  };

  const fieldOptions = getFieldOptions();

  return (
    <div className="flex flex-wrap gap-2">
      {fieldOptions.map((option, index) => (
        <AutoFillOption 
          key={index} 
          label={option.label} 
          getValue={option.getValue} 
          field={option.field} 
          onFill={option.onFill} 
        />
      ))}
    </div>
  );
};

export default AutoFillManager;
