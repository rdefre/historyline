# 🎮 History Line

**Um simulador de vida através dos séculos (1500-2100)**

Jogo mobile estilo BitLife, mas focado em realismo histórico e consequências geracionais.

---

## 🚀 Como Rodar

### 1️⃣ Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 2️⃣ Iniciar o Projeto

```bash
npx expo start
```

### 3️⃣ Abrir no Celular

- Instale o app **Expo Go** no seu celular (Android/iOS)
- Escaneie o QR code que aparece no terminal

---

## 📁 Estrutura do Projeto

```
HistoryLine/
├── App.tsx                    # Arquivo principal do jogo
├── src/
│   ├── constants/
│   │   └── colors.ts         # Paleta de cores histórica
│   └── types/
│       └── game.types.ts     # Tipos TypeScript
├── package.json
├── app.json
└── tsconfig.json
```

---

## 🎨 Recursos Implementados

### ✅ Versão Atual (v1.0)

- [x] Sistema de personagem com atributos (Vitalidade, Sanidade, Honra)
- [x] Sistema de idade (+1 ano por clique)
- [x] Evento aleatório: Inverno Rigoroso (15% chance/ano)
- [x] Morte por fome (quando Vitalidade chega a 0)
- [x] Efeito visual de fome (borda vermelha quando Vitalidade <= 30)
- [x] Log de eventos
- [x] Paleta de cores histórica (tons terrosos)

### 🚧 Em Desenvolvimento

- [ ] Sistema de eventos baseado em JSON
- [ ] Múltiplas eras históricas (1500-2100)
- [ ] Sistema de sucessão (jogar com herdeiros)
- [ ] Relacionamentos (família, amigos, inimigos)
- [ ] Profissões dinâmicas por era
- [ ] Pixel art do personagem
- [ ] Sistema de herança (Baú da Família)
- [ ] Eventos históricos reais
- [ ] Salvamento automático

---

## 🎯 Conceito do Jogo

### O Diferencial

Diferente do BitLife, o **History Line** foca em:

1. **Realismo Histórico**: As regras mudam conforme a época
2. **Consequências Geracionais**: Suas ações afetam seus descendentes
3. **Sobrevivência**: Em 1500, sobreviver é difícil. Em 2024, é sobre status.
4. **Herança Física**: Você passa itens (espadas, joias) através das gerações

### Eras do Jogo

- 🏰 **Era Colonial** (1500-1800): Sobrevivência, fome, doenças
- 🏭 **Era Industrial** (1800-1920): Trabalho pesado, acidentes, guerras
- 🏙️ **Era Moderna** (1920-2000): Educação, carreira, família
- 💻 **Era Contemporânea** (2000-2050): Tecnologia, redes sociais, estresse
- 🚀 **Era Futura** (2050-2100): IA, bioética, crise climática

---

## 🎨 Paleta de Cores

O jogo usa uma paleta inspirada em **pergaminhos antigos** e **madeira envelhecida**:

- **Fundo**: `#2B2520` (Marrom pergaminho)
- **Destaque**: `#D4AF37` (Ouro histórico)
- **Texto**: `#E8DCC8` (Bege claro)
- **Vitalidade**: `#C44536` (Vermelho sangue)
- **Sanidade**: `#5B7C99` (Azul aço)
- **Honra**: `#7A6F58` (Verde oliva)

Veja o arquivo completo: `src/constants/colors.ts`

---

## 📝 Roadmap

### Fase 1: Core Gameplay ✅
- Sistema básico de personagem
- Envelhecimento
- Eventos aleatórios simples

### Fase 2: Eventos Ricos 🚧
- Sistema de eventos em JSON
- 100+ eventos contextualizados por era
- Escolhas com consequências

### Fase 3: Gerações 🔜
- Sistema de filhos e sucessão
- Árvore genealógica
- Herança de atributos e itens

### Fase 4: Visual 🔜
- Pixel art do personagem
- Animações de eventos
- UI polida

### Fase 5: Conteúdo 🔜
- Eventos históricos reais
- Sistema de profissões por era
- Relacionamentos complexos

---

## 🛠️ Tecnologias

- **React Native** (Expo)
- **TypeScript**
- **AsyncStorage** (para save/load)

---

## 👨‍💻 Desenvolvedor

Projeto criado como um simulador de vida realista e histórico.

**Desenvolvido com muito ☕ e 📚 pesquisa histórica**

---

## 📄 Licença

Este projeto é para fins educacionais e de entretenimento.

---

## 🎮 Como Jogar

1. Você nasce em uma família em 1500
2. Clique em **+IDADE** para envelhecer
3. Tome decisões em eventos aleatórios
4. Tente sobreviver e acumular riqueza
5. Quando morrer, continue com seu herdeiro
6. Objetivo: Fazer sua linhagem chegar em 2100!

**Boa sorte, sobrevivente! ⚔️**
