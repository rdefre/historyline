# 📋 INSTRUÇÕES PARA CLAUDE CODE
# Expandir Eventos de Infância por Classe Social

## 🎯 OBJETIVO:
Completar o arquivo `childhoodEventsByClass.ts` com **300 eventos totais**:
- 100 eventos de CAMPONÊS
- 100 eventos de ARTESÃO  
- 50 eventos de GENTRY
- 50 eventos de NOBREZA

---

## 📂 ARQUIVO BASE:
`/src/data/childhoodEventsByClass.ts`

Este arquivo já tem:
- ✅ Estrutura TypeScript completa
- ✅ ~30 eventos de CAMPONÊS como exemplo
- ✅ ~5 eventos de ARTESÃO como exemplo
- ✅ ~2 eventos de GENTRY como exemplo
- ✅ ~2 eventos de NOBREZA como exemplo
- ✅ Sistema de filtragem funcionando

---

## 📝 FORMATO EXATO DE CADA EVENTO:

```typescript
{
  id: 'classe_descrição_unica',  // Ex: peasant_harvest_time
  title: '🌾 Título Com Emoji',
  description: 'Descrição contextual realista.',
  minAge: 5,
  maxAge: 12,
  chance: 0.15,  // Probabilidade (0.0 a 1.0)
  category: 'work' | 'family' | 'education' | 'leisure' | 'danger' | 'community' | 'neutral',
  requiredEra: ['tudor'],
  
  // Opcional: Requer situação específica
  requiresFlags?: {
    livingWith: ['parents'] | ['relative'] | ['alone']
  },
  
  // Opcional: Condições
  conditions?: {
    socialClasses: ['peasant'],
    gender?: 'male' | 'female',
    minMoney?: 50,
    maxMoney?: 100
  },
  
  options: [
    {
      text: 'Ação possível 1',
      preview: '💪 +10 Força | ❤️ -5 Vitalidade',  // Mostrar TODAS mudanças
      result: {
        message: 'Consequência narrativa.',
        strengthChange: 10,
        healthChange: -5,
      },
    },
    {
      text: 'Ação possível 2',
      preview: '🛡️ -15 Honra',
      result: {
        message: 'Outra consequência.',
        honorChange: -15,
      },
    },
  ],
}
```

---

## 🌾 CAMPONÊS - 100 EVENTOS

### CATEGORIAS (distribuição sugerida):
- **Trabalho e Sobrevivência (30 eventos)** ✅ ~30 FEITOS
  - Trabalhar no campo
  - Cuidar de animais
  - Buscar água/lenha
  - Ajudar na colheita
  - Plantar/arar/moer
  - Trabalho forçado para o Lorde

- **Fome e Escassez (25 eventos)** - CRIAR
  - Passar fome
  - Roubar comida
  - Dividir comida com irmãos
  - Comer coisas estranhas (casca, rato, grama)
  - Mendigar
  - Inverno rigoroso
  - Colheita ruim

- **Doenças e Acidentes (20 eventos)** - CRIAR
  - Febres/infecções
  - Acidentes de trabalho
  - Cortes/queimaduras
  - Picadas/mordidas
  - Piolhos/vermes
  - Dentes podres
  - Ossos quebrados
  - Quase afogar

- **Família e Relacionamentos (15 eventos)** - CRIAR
  - Irmão nasce/morre
  - Pai bêbado/violento
  - Mãe doente
  - Ajudar irmãos
  - Brigas familiares
  - Morte de parente
  - Órfão

- **Lazer e Brincadeiras (10 eventos)** - CRIAR
  - Brincar na lama
  - Nadar no rio
  - Lutas de gravetos
  - Perseguir animais
  - Fazer brinquedos toscos
  - Cantar/dançar
  - Contar histórias

---

## ⚒️ ARTESÃO - 100 EVENTOS

### CATEGORIAS:
- **Aprendizado de Ofício (30 eventos)** - CRIAR
  - Primeira lição do pai
  - Praticar técnicas
  - Estragar material
  - Fazer primeira peça
  - Aprender segredos do ofício
  - Usar ferramentas
  - Diferentes ofícios: ferreiro, carpinteiro, padeiro, alfaiate, sapateiro

- **Comércio e Clientes (20 eventos)** - CRIAR
  - Atender cliente
  - Vender no mercado
  - Negociar preços
  - Cliente insatisfeito
  - Cliente rico/pobre
  - Receber pagamento
  - Ser enganado

- **Vida Urbana (20 eventos)** - CRIAR
  - Feira da vila
  - Procissões
  - Festivais
  - Encontrar amigos na praça
  - Ver execução pública
  - Incêndio na vila
  - Briga entre oficinas

- **Educação (15 eventos)** - CRIAR
  - Escola básica (aprender a ler)
  - Igreja/catecismo
  - Matemática básica
  - Aprender línguas
  - Biblioteca
  - Padre ensina

- **Família e Oficina (15 eventos)** - CRIAR
  - Pai ensina
  - Mãe costura
  - Irmão ajuda
  - Rival (outra oficina)
  - Herdar ferramentas
  - Expandir negócio

---

## 🏰 GENTRY - 50 EVENTOS

### CATEGORIAS:
- **Educação Formal (15 eventos)** - CRIAR
  - Tutor particular
  - Latim/Grego
  - Filosofia
  - História
  - Aritmética avançada
  - Esgrima
  - Equitação

- **Etiqueta e Sociedade (15 eventos)** - CRIAR
  - Aprender modos à mesa
  - Dançar em baile
  - Conhecer outras famílias nobres
  - Errar protocolo
  - Impressionar visitantes
  - Conversar com adultos

- **Caçadas e Esportes (10 eventos)** - CRIAR
  - Caçar com pai
  - Cavalgar
  - Falcoaria
  - Arqueiro
  - Torneios juvenis

- **Gestão de Propriedades (10 eventos)** - CRIAR
  - Ver pai administrar
  - Conhecer terras
  - Falar com servos
  - Aprender contabilidade
  - Visitar fazendas

---

## 👑 NOBREZA - 50 EVENTOS

### CATEGORIAS:
- **Política de Corte (15 eventos)** - CRIAR
  - Conhecer o Rei
  - Eventos na corte
  - Intrigas familiares
  - Alianças políticas
  - Favores reais
  - Escândalos

- **Casamentos Arranjados (10 eventos)** - CRIAR
  - Noivado desde criança
  - Conhecer prometido(a)
  - Negociações familiares
  - Recusar casamento
  - União de reinos

- **Educação de Elite (10 eventos)** - CRIAR
  - Tutores famosos
  - Línguas estrangeiras
  - Arte/música
  - Diplomacia
  - Estudar no exterior

- **Privilégios e Luxo (10 eventos)** - CRIAR
  - Banquetes
  - Presentes caros
  - Viagens
  - Servos pessoais
  - Roupas de seda
  - Joias

- **Responsabilidades (5 eventos)** - CRIAR
  - Aprender a liderar
  - Comandar servos
  - Representar família
  - Herdar títulos cedo

---

## ⚠️ REGRAS IMPORTANTES:

### 1. **Realismo Histórico:**
- Camponês: vida dura, fome, trabalho infantil normal
- Artesão: vida melhor mas não rica, orgulho do ofício
- Gentry: conforto, educação, responsabilidades
- Nobreza: luxo, política, pressão social

### 2. **Chances (Probability):**
- Eventos comuns: 0.15 - 0.25
- Eventos raros: 0.05 - 0.10
- Eventos muito raros: 0.01 - 0.03

### 3. **Preview String:**
**SEMPRE** mostrar mudanças nos stats no preview:
```
✅ BOM: '💪 +10 Força | ❤️ -5 Vitalidade'
❌ RUIM: 'Você fica cansado'
```

### 4. **IDs únicos:**
Use o padrão: `classe_descrição`
- `peasant_harvest_time`
- `artisan_sell_product`
- `gentry_hunting_lesson`
- `nobility_meet_king`

### 5. **Emojis:**
Use emojis descritivos nos títulos:
- 🌾 Agricultura
- 🔨 Trabalho
- 💰 Dinheiro
- ❤️ Saúde
- 🛡️ Honra
- ⛪ Fé
- 💪 Força
- 👑 Realeza
- 🏰 Nobreza

---

## 🎯 TAREFA:

1. Abrir arquivo `/src/data/childhoodEventsByClass.ts`
2. Expandir array `PEASANT_EVENTS` para 100 eventos
3. Expandir array `ARTISAN_EVENTS` para 100 eventos
4. Expandir array `GENTRY_EVENTS` para 50 eventos
5. Expandir array `NOBILITY_EVENTS` para 50 eventos
6. Garantir que todos seguem o formato exato
7. Testar se compila (TypeScript)

---

## 📊 CHECKLIST:

- [ ] 100 eventos de Camponês
- [ ] 100 eventos de Artesão
- [ ] 50 eventos de Gentry
- [ ] 50 eventos de Nobreza
- [ ] Todos têm preview correto
- [ ] Todos têm IDs únicos
- [ ] Categorias balanceadas
- [ ] Código compila sem erros

---

## 🚀 BOA SORTE, CLAUDE CODE!

Se tiver dúvidas sobre formato, veja os eventos de exemplo já no arquivo!
