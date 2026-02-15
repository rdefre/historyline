# Assets de Avatar

Esta pasta contém os arquivos PNG transparentes usados para montar o avatar do personagem.

## Estrutura de Pastas

```
assets/avatars/
├── base/           # Corpos base por faixa etária
│   ├── body-infant.png
│   ├── body-child.png
│   ├── body-teen.png
│   ├── body-adult.png
│   ├── body-middle.png
│   └── body-elder.png
├── clothes/        # Roupas por era e idade
│   ├── clothes-tudor-infant.png
│   ├── clothes-tudor-child.png
│   ├── clothes-tudor-teen.png
│   ├── clothes-tudor-adult.png
│   ├── clothes-tudor-middle.png
│   └── clothes-tudor-elder.png
├── health/         # Overlays de saúde (opcional)
│   ├── overlay-critical.png
│   └── overlay-poor.png
└── accessories/    # Acessórios por era (opcional)
    └── accessory-tudor.png
```

## Como Funciona

O componente `CharacterAvatar` empilha as imagens na seguinte ordem (da base para o topo):

1. **Corpo base** - Baseado na idade do personagem
2. **Roupas** - Baseado na era histórica e idade
3. **Overlay de saúde** - Apenas se a saúde estiver baixa (< 50)
4. **Acessórios** - Apenas para adultos/middle/elder, baseado na era

## Requisitos das Imagens

- **Formato**: PNG com transparência
- **Tamanho recomendado**: 200x200px ou 400x400px (quadrado)
- **Alinhamento**: Todas as imagens devem estar centralizadas e alinhadas
- **Transparência**: Use fundo transparente para permitir empilhamento

## Adicionando Novas Imagens

1. Adicione o arquivo PNG na pasta apropriada
2. Descomente e atualize o mapeamento em `components/CharacterAvatar.tsx` no objeto `avatarAssets`
3. Use a convenção de nomenclatura: `categoria-nome-era-idade.png`

## Exemplo de Uso

```tsx
import CharacterAvatar from '@/components/CharacterAvatar';

<CharacterAvatar
  age={25}
  health={75}
  era="tudor"
  size={120}
/>
```
