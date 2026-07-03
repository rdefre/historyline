/**
 * PALETA DE CORES - HISTORY LINE
 * Design system estilo BitLife: light mode limpo, cores vibrantes,
 * cards brancos e acentos fortes.
 *
 * A estrutura de tokens é semântica — os nomes históricos (gold, bronze)
 * foram mantidos para compatibilidade, mas agora apontam para a paleta viva.
 */

export const COLORS = {
  // === BACKGROUNDS ===
  background: {
    primary: '#F2F4F8',      // Fundo geral do app (cinza-azulado claríssimo)
    secondary: '#FFFFFF',    // Cards e superfícies elevadas
    tertiary: '#E7EBF2',     // Trilhas de barras, divisores, bordas suaves
  },

  // === ACCENTS (Destaques) ===
  accent: {
    gold: '#1B9DE4',         // Azul BitLife (ação primária, títulos, destaques)
    bronze: '#E9F3FC',       // Tinta azul clara (botões secundários, bordas de card)
    amber: '#FFB020',        // Âmbar vivo (hover / destaques quentes)
  },

  // === STATUS BARS ===
  status: {
    health: '#FF4D5E',       // Vermelho vivo (Vitalidade)
    sanity: '#3E8EF7',       // Azul vibrante (Fé / Sanidade)
    honor: '#9B59F6',        // Violeta (Honra)
    intelligence: '#12B886', // Verde-esmeralda (Inteligência)
  },

  // === FEEDBACK ===
  feedback: {
    success: '#2ECC71',      // Verde vivo (Sucesso)
    warning: '#F59E0B',      // Laranja (Aviso)
    error: '#EF4444',        // Vermelho (Erro)
    info: '#8A94A6',         // Cinza azulado (Info)
  },

  // === TEXT ===
  text: {
    primary: '#1F2430',      // Quase-preto azulado (texto principal)
    secondary: '#7A8494',    // Cinza médio (texto de apoio)
    highlight: '#3A4354',    // Cinza escuro (subtítulos de destaque)
    disabled: '#B9C2CE',     // Cinza claro (inativo)
  },

  // === SPECIAL ===
  special: {
    premium: '#FFC531',      // Ouro vivo (dinheiro, premium)
    silver: '#C0C7D1',       // Prata
    ruby: '#E5484D',         // Rubi
  },

  // === UI (novos tokens do redesign) ===
  ui: {
    shadow: '#0F1A2B',                 // Cor base das sombras
    divider: '#EDF0F5',                // Linhas divisórias
    pillGreen: '#2ECC71',              // Botão de envelhecer / ações positivas
    pillRed: '#FF4D5E',                // Ações destrutivas
    tintBlue: 'rgba(27, 157, 228, 0.12)',  // Fundo de item ativo
    tintRed: 'rgba(239, 68, 68, 0.10)',    // Fundo de aviso/perigo
    tintGold: 'rgba(255, 197, 49, 0.16)',  // Fundo dourado suave (dinheiro)
  },
};

/**
 * Cor da barra de status baseada no valor, estilo BitLife:
 * verde quando alto, degradando até vermelho quando crítico.
 */
export function statusColorForValue(value: number): string {
  if (value <= 25) return '#FF4D5E';   // crítico — vermelho
  if (value <= 50) return '#FF9F2E';   // baixo — laranja
  if (value <= 75) return '#FFD230';   // médio — amarelo
  return '#2ECC71';                    // alto — verde
}

export default COLORS;
