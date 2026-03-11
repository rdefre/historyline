import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../constants/colors';
import type { Character, Child, GlobalEnemy } from '../types/game.types';
import { useViewContext } from '../context/ViewContext';
import PregnancyModal from './PregnancyModal';
import ChildInteractionModal from './ChildInteractionModal';

// ── Pick a random item from an array ─────────────────────────────────────────
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface RelationshipsViewProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  onNPCInteraction: (npcId: string, actionType: 'CHAT' | 'MONEY' | 'HELP_WORK' | 'ASK_TOY' | 'TANTRUM') => void;
  onEnemyInteraction: (enemyId: string, actionType: 'INSULT' | 'DUEL') => void;
  onAddToLog?: (message: string, type: 'neutral' | 'success' | 'fail') => void;
  onAddLog?: (message: string) => void; // escreve no log visível do Dashboard
  onSetCurrentEvent?: (event: any) => void;
}

interface NPCStats {
  vitality: number;
  faith: number;
  strength: number;
  honor: number;
  money: number;
}

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  age: number;
  gender: 'male' | 'female';
  occupation: string;
  relationship: number;
  isAlive: boolean;
  stats: NPCStats;
}

export default function RelationshipsView({
  character,
  setCharacter,
  onNPCInteraction,
  onEnemyInteraction,
  onAddToLog,
  onAddLog,
  onSetCurrentEvent,
}: RelationshipsViewProps) {
  const { setCurrentView } = useViewContext();
  const [selectedNPC, setSelectedNPC] = useState<FamilyMember | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnemy, setSelectedEnemy] = useState<GlobalEnemy | null>(null);
  const [showEnemyModal, setShowEnemyModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showPregnancy, setShowPregnancy] = useState(false);
  const [tempChildType, setTempChildType] = useState<'Legítimo' | 'Bastardo'>('Bastardo');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // ── Close modal and jump to dashboard so the log is visible ─────────────────
  const closeAndGoHome = (msg: string, type: 'success' | 'fail' | 'neutral') => {
    onAddLog?.(msg);          // escreve no log visível do Dashboard
    onAddToLog?.(msg, type);  // registra no histórico por ano
    setShowPartnerModal(false);
    setCurrentView('DASHBOARD');
  };

  // ── Annual cooldown helpers ───────────────────────────────────────────────────
  const doneThisYear = (actionId: string) =>
    (character.partnerActionsThisYear ?? []).includes(actionId);

  const markDone = (actionId: string) =>
    setCharacter(prev =>
      prev ? { ...prev, partnerActionsThisYear: [...(prev.partnerActionsThisYear ?? []), actionId] } : prev
    );

  // Gerar lista de família
  const getFamilyMembers = (): FamilyMember[] => {
    const members: FamilyMember[] = [];
    const defaultStats: NPCStats = { vitality: 50, faith: 50, strength: 50, honor: 50, money: 0 };

    if (character.family.fatherName) {
      members.push({
        id: 'father',
        name: `${character.family.fatherName} ${character.surname}`,
        role: 'Pai',
        age: character.family.fatherAge || 30,
        gender: 'male',
        occupation: character.family.fatherOccupation,
        relationship: character.family?.fatherRelationship || 50,
        isAlive: character.family.fatherAlive !== false,
        stats: character.family.fatherStats || defaultStats,
      });
    }

    if (character.family.motherName) {
      members.push({
        id: 'mother',
        name: character.family.motherName,
        role: 'Mãe',
        age: character.family.motherAge || 28,
        gender: 'female',
        occupation: getMotherOccupation(character.socialClass),
        relationship: character.family?.motherRelationship || 50,
        isAlive: character.family.motherAlive !== false,
        stats: character.family.motherStats || defaultStats,
      });
    }

    if (character.siblings && character.siblings.length > 0) {
      character.siblings.forEach((sibling) => {
        members.push({
          id: sibling.id,
          name: `${sibling.name} ${character.surname}`,
          role: sibling.gender === 'male' ? 'Irmão' : 'Irmã',
          age: sibling.age,
          gender: sibling.gender,
          occupation: sibling.age < 7 ? 'Criança' : 'Ajudante',
          relationship: sibling.relationship,
          isAlive: true,
          stats: sibling.stats || defaultStats,
        });
      });
    }

    return members;
  };

  const getMotherOccupation = (socialClass: string): string => {
    switch (socialClass) {
      case 'nobility': return 'Lady da Casa';
      case 'gentry':   return 'Dona de Casa';
      case 'artisan':  return 'Costureira';
      default:         return 'Camponesa';
    }
  };

  const getRelationshipColor = (value: number): string => {
    if (value >= 70) return '#4ade80';
    if (value >= 40) return '#fbbf24';
    return '#ef4444';
  };

  const renderStatBar = (label: string, value: number, color: string) => (
    <View key={label} style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarBg}>
        <View style={[styles.statBarFill, { width: `${value}%` as `${number}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const handleNPCPress = (member: FamilyMember) => {
    setSelectedNPC(member);
    setShowModal(true);
  };

  const handleAction = (actionType: 'CHAT' | 'MONEY' | 'HELP_WORK' | 'ASK_TOY' | 'TANTRUM') => {
    if (!selectedNPC) return;
    onNPCInteraction(selectedNPC.id, actionType);
    setShowModal(false);
  };

  const handleEnemyPress = (enemy: GlobalEnemy) => {
    setSelectedEnemy(enemy);
    setShowEnemyModal(true);
  };

  const handleEnemyAction = (actionType: 'INSULT' | 'DUEL') => {
    if (!selectedEnemy) return;
    setShowEnemyModal(false);
    onEnemyInteraction(selectedEnemy.id, actionType);
  };

  const isChildAge = character.age < 13;
  const isWorkingClass = character.socialClass === 'peasant' || character.socialClass === 'artisan';
  const canHelpWork = character.age >= 6 && isWorkingClass;
  const familyMembers = getFamilyMembers();
  const enemies = (character.globalEnemies ?? []).filter(e => e.type === 'ENEMY');

  // ── Partner action helpers ────────────────────────────────────────────────────

  const partnerEmoji = character.partner
    ? (character.partner.gender === 'Feminino' ? '👩' : '👨')
    : '';

  const handleGiveGift = () => {
    const p = character.partner!;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    const actionId = 'presente';
    if (doneThisYear(actionId)) {
      closeAndGoHome(`🎁 Você já presenteou ${e} ${p.name} este ano. (Sem efeito adicional este ano)`, 'neutral');
      return;
    }
    const cost = 8;
    if (character.money < cost) {
      Alert.alert('💰 Moedas insuficientes', `Você precisa de ${cost} 💰.`);
      return;
    }
    const msg = pick([
      `🎁 Você presenteou ${e} ${p.name} com um pequeno mimo. Os olhos dela brilharam de gratidão.`,
      `🎁 ${e} ${p.name} ficou radiante com o seu gesto. O coração dela se abriu mais para você.`,
      `🎁 Você entregou um presente para ${e} ${p.name}. Ela sorriu e apertou sua mão com carinho.`,
    ]);
    setCharacter(prev => {
      if (!prev?.partner) return prev;
      return { ...prev, money: prev.money - cost, partner: { ...prev.partner, relationship: Math.min(100, prev.partner.relationship + 15) } };
    });
    markDone(actionId);
    closeAndGoHome(msg, 'success');
  };

  const handleSpendTime = () => {
    const p = character.partner!;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    const actionId = 'passar_tempo';
    if (doneThisYear(actionId)) {
      closeAndGoHome(`⏳ Você já passou tempo com ${e} ${p.name} este ano. (Sem efeito adicional este ano)`, 'neutral');
      return;
    }
    const msg = pick([
      `⏳ Você e ${e} ${p.name} passaram a tarde juntos, caminhando pelos campos. Foi um momento singelo e feliz.`,
      `⏳ ${e} ${p.name} contou histórias enquanto você ouvia atentamente. O tempo voou.`,
      `⏳ Você passou tempo de qualidade com ${e} ${p.name}. A proximidade entre vocês cresceu.`,
    ]);
    setCharacter(prev => {
      if (!prev?.partner) return prev;
      return { ...prev, partner: { ...prev.partner, relationship: Math.min(100, prev.partner.relationship + 5) } };
    });
    markDone(actionId);
    closeAndGoHome(msg, 'success');
  };

  const handleTalk = () => {
    const p = character.partner!;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    const actionId = 'conversar';
    if (doneThisYear(actionId)) {
      closeAndGoHome(`🗣️ Você já conversou com ${e} ${p.name} este ano. (Sem efeito adicional este ano)`, 'neutral');
      return;
    }
    const success = Math.random() < 0.85;
    if (success) {
      const msg = pick([
        `🗣️ Você e ${e} ${p.name} tiveram uma conversa longa e sincera. Vocês se entendem cada vez mais.`,
        `🗣️ ${e} ${p.name} ouviu você com atenção. A confiança entre vocês cresceu.`,
        `🗣️ Uma boa conversa com ${e} ${p.name} deixou o ambiente mais leve e íntimo.`,
      ]);
      setCharacter(prev => {
        if (!prev?.partner) return prev;
        return { ...prev, partner: { ...prev.partner, relationship: Math.min(100, prev.partner.relationship + 8) } };
      });
      markDone(actionId);
      closeAndGoHome(msg, 'success');
    } else {
      const msg = pick([
        `💬 A conversa com ${e} ${p.name} descambou para uma discussão acalorada. O silêncio ficou pesado.`,
        `💬 Você disse algo que ${e} ${p.name} não gostou. Ela se retirou sem falar mais.`,
        `💬 ${e} ${p.name} e você discutiram por uma bobagem. O clima ficou tenso.`,
      ]);
      setCharacter(prev => {
        if (!prev?.partner) return prev;
        return { ...prev, partner: { ...prev.partner, relationship: Math.max(0, prev.partner.relationship - 12) } };
      });
      markDone(actionId);
      closeAndGoHome(msg, 'fail');
    }
  };

  const handleCompliment = () => {
    const p = character.partner!;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    const actionId = 'elogiar';
    if (doneThisYear(actionId)) {
      closeAndGoHome(`💋 Você já elogiou ${e} ${p.name} este ano. (Sem efeito adicional este ano)`, 'neutral');
      return;
    }
    const msg = pick([
      `💋 Você elogiou ${e} ${p.name} com palavras doces. Ela corou e desviou o olhar, sorrindo.`,
      `💋 Suas palavras encantaram ${e} ${p.name}. Ela disse que nunca ninguém havia falado assim com ela.`,
      `💋 ${e} ${p.name} ficou radiante com seu elogio. "Você tem um dom para as palavras", ela disse.`,
    ]);
    setCharacter(prev => {
      if (!prev?.partner) return prev;
      return { ...prev, partner: { ...prev.partner, relationship: Math.min(100, prev.partner.relationship + 4) } };
    });
    markDone(actionId);
    closeAndGoHome(msg, 'success');
  };

  const handleInsult = () => {
    const p = character.partner!;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    const actionId = 'insultar';
    if (doneThisYear(actionId)) {
      closeAndGoHome(`🤬 Você já insultou ${e} ${p.name} este ano. (Sem efeito adicional este ano)`, 'neutral');
      return;
    }
    const slap = Math.random() < 0.2;
    const variants = slap ? [
      `🤬 Você insultou ${e} ${p.name} cruelmente. Ela não tolerou e te acertou um tapa que ecoou pela sala.`,
      `🤬 Suas palavras foram longe demais com ${e} ${p.name}. Ela revidou com um tapa certeiro antes de sair.`,
      `🤬 ${e} ${p.name} ouviu o insulto e perdeu a paciência. Um tapa forte deixou sua face ardendo.`,
    ] : [
      `🤬 Você insultou ${e} ${p.name} de forma cruel. Ela saiu em lágrimas, a relação abalada.`,
      `🤬 Suas palavras feriram ${e} ${p.name} profundamente. O silêncio que se seguiu foi mais pesado que qualquer briga.`,
      `🤬 ${e} ${p.name} ficou boquiaberta com seu insulto. Ela disse que jamais esperaria isso de você.`,
    ];
    const msg = pick(variants);
    setCharacter(prev => {
      if (!prev?.partner) return prev;
      const updates: Partial<Character> = {
        partner: { ...prev.partner!, relationship: Math.max(0, prev.partner!.relationship - 20) },
        honor: Math.max(0, (prev.honor ?? 50) - 5),
      };
      if (slap) updates.health = Math.max(0, (prev.health ?? 50) - 5);
      return { ...prev, ...updates };
    });
    markDone(actionId);
    closeAndGoHome(msg, 'fail');
  };

  const handleBuyHerbs = () => {
    const p = character.partner!;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    const actionId = 'ervas';
    if (doneThisYear(actionId)) {
      closeAndGoHome(`🌿 Você já comprou ervas de arruda este ano. (Sem efeito adicional este ano)`, 'neutral');
      return;
    }
    const cost = 5;
    if (character.money < cost) {
      Alert.alert('💰 Moedas insuficientes', `Você precisa de ${cost} 💰.`);
      return;
    }
    const msg = pick([
      `🌿 Você adquiriu ervas de arruda de uma curandeira. Sua consciência pesou, mas a precaução prevaleceu.`,
      `🌿 Com discreção, você comprou as ervas de arruda. A fé vacilou, mas a prudência falou mais alto.`,
      `🌿 As ervas de arruda estão guardadas. Uma pequena traição à fé, mas necessária antes de encontrar ${e} ${p.name}.`,
    ]);
    setCharacter(prev => {
      if (!prev) return prev;
      return { ...prev, money: prev.money - cost, faith: Math.max(0, (prev.faith ?? 50) - 5), birthControlActive: true };
    });
    markDone(actionId);
    closeAndGoHome(msg, 'neutral');
  };

  const handlePassion = () => {
    if (!character?.partner) return;
    const p = character.partner;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    const actionId = 'paixao';

    if (doneThisYear(actionId)) {
      closeAndGoHome(
        `🔥 Você já se entregou à paixão com ${e} ${p.name} este ano. (Sem efeito adicional este ano)`,
        'neutral',
      );
      return;
    }

    const syphilis = Math.random() < 0.15;
    const biologicallyCompatible = character.gender !== p.gender;
    const isPregnant =
      biologicallyCompatible && (character.devForcePregnancy || (!character.birthControlActive && Math.random() < 0.2));
    const childType: 'Legítimo' | 'Bastardo' =
      p.status === 'Esposa' || p.status === 'Esposo' ? 'Legítimo' : 'Bastardo';

    setCharacter(prev => {
      if (!prev) return prev;
      const updates: Partial<Character> = {
        health: Math.min(100, (prev.health ?? 50) + 25),
        birthControlActive: false,
        devForcePregnancy: false,
      };
      if (syphilis) updates.hasSyphilis = true;
      return { ...prev, ...updates };
    });

    markDone(actionId);

    if (syphilis) {
      const syphilisMsg = `⚠️ Nos dias seguintes, sintomas estranhos surgiram. Você pode ter contraído o Mal Francês.`;
      onAddLog?.(syphilisMsg);
      onAddToLog?.(syphilisMsg, 'fail');
    }

    if (isPregnant) {
      setTempChildType(childType);
      setShowPartnerModal(false);
      setShowPregnancy(true);
    } else {
      closeAndGoHome('🔥 Vocês se entregaram à paixão. Uma noite inesquecível.', 'success');
    }
  };

  const handleChildAction = (actionId: string, cost: number) => {
    if (!selectedChild) return;

    if (cost > 0 && (character.money ?? 0) < cost) {
      closeAndGoHome('Você não tem moedas suficientes para isso.', 'fail');
      return;
    }

    const childId = selectedChild.id;
    let logMsg = '';
    let logType: 'success' | 'fail' | 'neutral' = 'neutral';

    setCharacter(prev => {
      if (!prev) return prev;

      const child = prev.children?.find(c => c.id === childId);
      if (!child && actionId !== 'herdeiro') return prev;

      let updatedChild: Child | null = child ? { ...child } : null;
      let moneyDelta = -cost;
      let honorDelta = 0;
      const cooldownKey = `${actionId}_${childId}`;
      const newCooldowns = [...(prev.childActionsThisYear ?? [])];

      switch (actionId) {
        case 'brincar':
          if (newCooldowns.includes(cooldownKey)) {
            logMsg = `🧸 Você já brincou com ${child!.name} este ano.`;
            logType = 'neutral';
            return prev;
          }
          updatedChild!.relationship = Math.min(100, (updatedChild!.relationship ?? 50) + 5);
          newCooldowns.push(cooldownKey);
          logMsg = `🧸 Você passou um tempo precioso com ${child!.name}. (+5 relacionamento)`;
          logType = 'success';
          break;

        case 'curar':
          if (Math.random() < 0.9) {
            updatedChild!.health = Math.min(100, (updatedChild!.health ?? 80) + 20);
            logMsg = `🩸 O curandeiro tratou ${child!.name} com êxito. (+20 saúde)`;
            logType = 'success';
          } else {
            updatedChild!.health = Math.max(0, (updatedChild!.health ?? 80) - 20);
            logMsg = `🩸 O curandeiro tentou tratar ${child!.name}, mas o estado piorou. (-20 saúde)`;
            logType = 'fail';
          }
          break;

        case 'batizar':
          updatedChild!.isBaptized = true;
          updatedChild!.relationship = Math.min(100, (updatedChild!.relationship ?? 50) + 10);
          honorDelta = 15;
          logMsg = `✝️ ${child!.name} foi batizado na graça de Deus. (+15 honra, +10 relacionamento)`;
          logType = 'success';
          break;

        case 'abandonar':
          honorDelta = -30;
          logMsg = `🧺 Você abandonou ${child!.name} na porta da Igreja. A vergonha assombra sua alma. (-30 honra)`;
          logType = 'fail';
          updatedChild = null; // signals removal
          break;

        case 'mosteiro':
          updatedChild!.profession = 'Clero';
          honorDelta = 20;
          logMsg = `⛪ ${child!.name} foi entregue à Igreja. Que Deus guie seus passos. (+20 honra)`;
          logType = 'success';
          break;

        case 'aprendizado':
          updatedChild!.profession = 'Aprendiz';
          logMsg = `🔨 ${child!.name} começou o aprendizado de um ofício.`;
          logType = 'success';
          break;

        case 'corte':
          updatedChild!.profession = 'Escudeiro';
          logMsg = `⚔️ ${child!.name} começou o treinamento militar na corte.`;
          logType = 'success';
          break;

        case 'herdeiro':
          logMsg = `👑 A funcionalidade de assumir herdeiro estará disponível em breve!`;
          logType = 'neutral';
          return prev;

        default:
          return prev;
      }

      const newChildren = updatedChild === null
        ? (prev.children ?? []).filter(c => c.id !== childId)
        : (prev.children ?? []).map(c => c.id === childId ? updatedChild! : c);

      return {
        ...prev,
        money: Math.max(0, (prev.money ?? 0) + moneyDelta),
        honor: Math.min(100, Math.max(0, (prev.honor ?? 50) + honorDelta)),
        children: newChildren,
        childActionsThisYear: newCooldowns,
      };
    });

    setSelectedChild(null);
    // Use setTimeout to ensure setCharacter has run before closing
    setTimeout(() => closeAndGoHome(logMsg, logType), 0);
  };

  const handlePropose = () => {
    const p = character.partner!;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    if (p.relationship < 80) {
      Alert.alert('💔 Relacionamento insuficiente', `Precisa de 80 de relacionamento (atual: ${p.relationship}).`);
      return;
    }
    const costMap: Record<string, number> = { 'Camponês': 30, 'Artesão': 150, 'Nobreza': 500 };
    const cost = costMap[p.socialClass] ?? 30;
    if (character.money < cost) {
      Alert.alert('💰 Moedas insuficientes', `Você precisa de ${cost} 💰 para se casar com alguém da classe ${p.socialClass}.`);
      return;
    }
    const newStatus = p.gender === 'Feminino' ? 'Esposa' : 'Esposo';
    const msg = pick([
      `💍 Você ajoelhou diante de ${e} ${p.name} e fez a pergunta. Ela disse sim entre lágrimas de alegria.`,
      `💍 Sob as bênçãos do padre, você e ${e} ${p.name} trocaram votos. Uma nova era começa.`,
      `💍 ${e} ${p.name} aceitou sua proposta. Os sinos da aldeia tocaram e todos comemoraram a união.`,
    ]);
    setCharacter(prev => {
      if (!prev?.partner) return prev;
      return { ...prev, money: prev.money - cost, partner: { ...prev.partner, status: newStatus as 'Esposa' | 'Esposo' } };
    });
    closeAndGoHome(msg, 'success');
  };

  const handleBreakup = () => {
    const p = character.partner!;
    const e = p.gender === 'Feminino' ? '👩' : '👨';
    Alert.alert(
      '💔 Terminar Relação',
      `Tem certeza que deseja terminar a relação com ${e} ${p.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: () => {
            const isMarried = p.status === 'Esposa' || p.status === 'Esposo';
            const msg = isMarried
              ? pick([
                  `💔 Você se separou de ${e} ${p.name}. A vila inteira falou mal de você. Sua honra foi manchada.`,
                  `💔 O divórcio com ${e} ${p.name} foi consumado. Uma desonra que assombrará seu nome por anos.`,
                  `💔 Você abandonou ${e} ${p.name}. O padre abalou a cabeça. Sua reputação sofreu um duro golpe.`,
                ])
              : pick([
                  `💔 Você encerrou o cortejo com ${e} ${p.name}. Ela saiu em silêncio, com a dignidade que lhe restava.`,
                  `💔 Você terminou o relacionamento com ${e} ${p.name}. Foi breve, mas deixou marcas.`,
                  `💔 ${e} ${p.name} ouviu a notícia com os olhos marejados. Vocês se separaram sem escândalo.`,
                ]);
            setCharacter(prev => {
              if (!prev) return prev;
              const updates: Partial<Character> = { partner: null };
              if (isMarried) updates.honor = Math.max(0, (prev.honor ?? 50) - 50);
              return { ...prev, ...updates };
            });
            closeAndGoHome(msg, 'fail');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Sua Família</Text>

      <ScrollView style={styles.scrollContainer} nestedScrollEnabled>
        {familyMembers.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum familiar encontrado.</Text>
        ) : (
          familyMembers.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={[styles.card, !member.isAlive && styles.cardDeceased]}
              onPress={() => handleNPCPress(member)}
              disabled={!member.isAlive}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{member.name}</Text>
                <Text style={styles.cardRole}>{member.role}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardAge}>
                  {member.isAlive ? `${member.age} anos` : 'Falecido(a)'}
                </Text>
                <Text style={styles.cardOccupation}>{member.occupation}</Text>
              </View>
              {member.isAlive && (
                <View style={styles.relationshipContainer}>
                  <Text style={styles.relationshipLabel}>Relação:</Text>
                  <View style={styles.relationshipBarBg}>
                    <View
                      style={[
                        styles.relationshipBarFill,
                        {
                          width: `${member.relationship}%` as `${number}%`,
                          backgroundColor: getRelationshipColor(member.relationship),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.relationshipValue}>{member.relationship}%</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}

        {/* ── Partner Section ─────────────────────────────────────────── */}
        {character.partner && (
          <>
            <View style={styles.sectionDivider} />
            <Text style={[styles.sectionTitle, { color: '#d46a8a' }]}>❤️ Companheiro(a)</Text>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => setShowPartnerModal(true)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>
                  {(character.partner.gender === 'Feminino' ? '👩' : '👨') + ' ' + character.partner.name}
                </Text>
                <Text style={[styles.cardRole, { color: COLORS.accent.gold }]}>
                  {character.partner.status}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardAge}>{character.partner.age} anos</Text>
                <Text style={[styles.cardOccupation, { fontStyle: 'italic' }]}>
                  {character.partner.occupation}
                </Text>
              </View>
              <View style={styles.relationshipContainer}>
                <Text style={styles.relationshipLabel}>Relação:</Text>
                <View style={styles.relationshipBarBg}>
                  <View
                    style={[
                      styles.relationshipBarFill,
                      {
                        width: `${character.partner.relationship}%` as `${number}%`,
                        backgroundColor: '#d46a8a',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.relationshipValue}>{character.partner.relationship}%</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* ── Children Section ────────────────────────────────────────── */}
        {(character.children ?? []).length > 0 && (
          <>
            <View style={styles.sectionDivider} />
            <Text style={[styles.sectionTitle, { color: '#7ecec4' }]}>👶 Filhos</Text>
            {(character.children ?? []).map((child) => (
              <TouchableOpacity key={child.id} style={styles.card} onPress={() => setSelectedChild(child)} activeOpacity={0.75}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>
                    {child.gender === 'Masculino' ? '👦' : '👧'} {child.name}
                  </Text>
                  <Text style={[styles.cardRole, { color: child.type === 'Legítimo' ? COLORS.accent.gold : '#aaa' }]}>
                    {child.type}
                  </Text>
                </View>
                <Text style={styles.cardAge}>{child.age} {child.age === 1 ? 'ano' : 'anos'}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ── Enemies Section ─────────────────────────────────────────── */}
        {enemies.length > 0 && (
          <>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>⚔️ Inimigos</Text>
            {enemies.map((enemy) => (
              <TouchableOpacity
                key={enemy.id}
                style={styles.enemyCard}
                onPress={() => handleEnemyPress(enemy)}
                activeOpacity={0.8}
              >
                <Text style={styles.enemyEmoji}>{enemy.emoji}</Text>
                <View style={styles.enemyInfo}>
                  <Text style={styles.enemyName}>{enemy.name}</Text>
                  <Text style={styles.enemyAge}>{enemy.age} anos</Text>
                </View>
                <View style={styles.enemyBadge}>
                  <Text style={styles.enemyBadgeText}>INIMIGO</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* ── Family Interaction Modal ─────────────────────────────────── */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowModal(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            {selectedNPC && (
              <View style={styles.profileCard}>
                <Text style={styles.profileEmoji}>
                  {selectedNPC.gender === 'male' ? '👨' : '👩'}
                </Text>
                <Text style={styles.profileName}>{selectedNPC.name}</Text>
                <Text style={styles.profileRole}>
                  {selectedNPC.role} • {selectedNPC.age} anos
                </Text>
                <Text style={styles.profileMoney}>
                  💰 {selectedNPC.stats.money} moedas
                </Text>
                <View style={styles.profileBars}>
                  {renderStatBar('Vitalidade', selectedNPC.stats.vitality, '#ef4444')}
                  {renderStatBar('Fé', selectedNPC.stats.faith, '#c9a84c')}
                  {renderStatBar('Força', selectedNPC.stats.strength, '#f97316')}
                  {renderStatBar('Honra', selectedNPC.stats.honor, '#8b5cf6')}
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, character.age < 5 && styles.actionButtonDisabled]}
                onPress={() => handleAction('CHAT')}
                disabled={character.age < 5}
              >
                <Text style={styles.actionButtonText}>
                  💬 Conversar {character.age < 5 ? '(5+)' : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, character.age < 13 && styles.actionButtonDisabled]}
                onPress={() => handleAction('MONEY')}
                disabled={character.age < 13}
              >
                <Text style={styles.actionButtonText}>
                  💰 Pedir Dinheiro {character.age < 13 ? '(13+)' : ''}
                </Text>
              </TouchableOpacity>

              {isChildAge && isWorkingClass && (selectedNPC?.role === 'Pai' || selectedNPC?.role === 'Mãe') && (
                <TouchableOpacity
                  style={[styles.actionButton, !canHelpWork && styles.actionButtonDisabled]}
                  onPress={() => handleAction('HELP_WORK')}
                  disabled={!canHelpWork}
                >
                  <Text style={styles.actionButtonText}>
                    ⚒️ Ajudar no Trabalho{!canHelpWork ? ' (6+)' : ''}
                  </Text>
                </TouchableOpacity>
              )}

              {isChildAge && (selectedNPC?.role === 'Pai' || selectedNPC?.role === 'Mãe') && (
                <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('ASK_TOY')}>
                  <Text style={styles.actionButtonText}>🪀 Pedir Brinquedo</Text>
                </TouchableOpacity>
              )}

              {isChildAge && (
                <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('TANTRUM')}>
                  <Text style={styles.actionButtonText}>😤 Fazer Birra</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Enemy Profile Modal ──────────────────────────────────────── */}
      <Modal
        visible={showEnemyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEnemyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowEnemyModal(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            {selectedEnemy && (
              <>
                {/* Enemy header */}
                <View style={styles.enemyProfileHeader}>
                  <Text style={styles.enemyProfileEmoji}>{selectedEnemy.emoji}</Text>
                  <Text style={styles.profileName}>{selectedEnemy.name}</Text>
                  <Text style={styles.profileRole}>Inimigo • {selectedEnemy.age} anos</Text>
                </View>

                {/* Stats */}
                <View style={[styles.profileCard, styles.enemyProfileCard]}>
                  <Text style={styles.enemyStatsTitle}>⚔️ Atributos de {selectedEnemy.name}</Text>
                  <View style={styles.profileBars}>
                    {renderStatBar('Força', selectedEnemy.strength, '#f97316')}
                    {/* Relationship locked at 0 */}
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Relação</Text>
                      <View style={styles.statBarBg}>
                        <View style={[styles.statBarFill, { width: '0%', backgroundColor: '#ef4444' }]} />
                      </View>
                      <Text style={[styles.statValue, { color: COLORS.feedback.error }]}>0%</Text>
                    </View>
                  </View>
                </View>

                {/* Hostile actions */}
                <View style={styles.modalActions}>
                  <Text style={styles.actionGroupLabel}>🗡️ Ações Hostis</Text>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.hostileButton]}
                    onPress={() => handleEnemyAction('INSULT')}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.actionButtonText}>😠 Insultar</Text>
                    <Text style={styles.actionPreview}>Provoca, sem consequências mecânicas</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.duelButton, character.age < 16 && styles.actionButtonDisabled]}
                    onPress={() => handleEnemyAction('DUEL')}
                    disabled={character.age < 16}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.actionButtonText}>⚔️ Desafiar para Duelo {character.age < 16 ? '(16+)' : ''}</Text>
                    <Text style={styles.actionPreview}>
                      Vitória: +25 Honra, inimigo removido{'\n'}Derrota: -35 Vitalidade, -25 Honra
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Partner Interaction Modal ────────────────────────────────── */}
      {character.partner && (
        <Modal
          visible={showPartnerModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPartnerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.partnerModalContent}>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowPartnerModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.partnerHeader}>
                  <Text style={styles.partnerHeaderEmoji}>{partnerEmoji}</Text>
                  <Text style={styles.profileName}>{character.partner.name}</Text>
                  <Text style={styles.profileRole}>
                    {character.partner.status} • {character.partner.age} anos • {character.partner.socialClass}
                  </Text>
                </View>

                {/* Stat bars */}
                <View style={[styles.profileCard, { marginTop: 10 }]}>
                  <View style={styles.profileBars}>
                    {([
                      ['Vitalidade',     character.partner.stats.vitality,  '#e05555'],
                      ['Força',          character.partner.stats.strength,   '#e09a30'],
                      ['Honra',          character.partner.stats.honor,      '#4a7abf'],
                      ['Riqueza',        character.partner.stats.wealth,     '#4aaf72'],
                      ['Relacionamento', character.partner.relationship,     '#d46a8a'],
                    ] as [string, number, string][]).map(([label, val, color]) =>
                      renderStatBar(label, val, color)
                    )}
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.partnerActions}>

                  {/* Dar um presente */}
                  <TouchableOpacity
                    style={styles.partnerActionBtn}
                    activeOpacity={0.8}
                    onPress={handleGiveGift}
                  >
                    <Text style={styles.partnerActionBtnText}>🎁 Dar um presente (8 💰)</Text>
                    <Text style={styles.partnerActionBtnSub}>+15 relacionamento</Text>
                  </TouchableOpacity>

                  {/* Passar tempo */}
                  <TouchableOpacity
                    style={styles.partnerActionBtn}
                    activeOpacity={0.8}
                    onPress={handleSpendTime}
                  >
                    <Text style={styles.partnerActionBtnText}>⏳ Passar tempo (Grátis)</Text>
                    <Text style={styles.partnerActionBtnSub}>+5 relacionamento</Text>
                  </TouchableOpacity>

                  {/* Conversar */}
                  <TouchableOpacity
                    style={styles.partnerActionBtn}
                    activeOpacity={0.8}
                    onPress={handleTalk}
                  >
                    <Text style={styles.partnerActionBtnText}>🗣️ Conversar (Grátis)</Text>
                    <Text style={styles.partnerActionBtnSub}>85%: +8 rel | 15%: -12 rel</Text>
                  </TouchableOpacity>

                  {/* Elogiar */}
                  <TouchableOpacity
                    style={styles.partnerActionBtn}
                    activeOpacity={0.8}
                    onPress={handleCompliment}
                  >
                    <Text style={styles.partnerActionBtnText}>💋 Elogiar (Grátis)</Text>
                    <Text style={styles.partnerActionBtnSub}>+4 relacionamento</Text>
                  </TouchableOpacity>

                  {/* Insultar */}
                  <TouchableOpacity
                    style={[styles.partnerActionBtn, { borderColor: '#a13a2f' }]}
                    activeOpacity={0.8}
                    onPress={handleInsult}
                  >
                    <Text style={styles.partnerActionBtnText}>🤬 Insultar (Grátis)</Text>
                    <Text style={styles.partnerActionBtnSub}>-20 rel, -5 honra, 20%: -5 vida</Text>
                  </TouchableOpacity>

                  {/* Ervas de arruda */}
                  <TouchableOpacity
                    style={styles.partnerActionBtn}
                    activeOpacity={0.8}
                    onPress={handleBuyHerbs}
                  >
                    <Text style={styles.partnerActionBtnText}>🌿 Comprar ervas de arruda (5 💰)</Text>
                    <Text style={styles.partnerActionBtnSub}>-5 fé, protege por 1 uso</Text>
                  </TouchableOpacity>

                  {/* Entregar-se à paixão */}
                  <TouchableOpacity
                    style={styles.partnerActionBtn}
                    activeOpacity={0.8}
                    onPress={handlePassion}
                  >
                    <Text style={styles.partnerActionBtnText}>🔥 Entregar-se à paixão</Text>
                    <Text style={styles.partnerActionBtnSub}>+25 vida | 15%: sífilis | 20%: filho bastardo</Text>
                  </TouchableOpacity>

                  {/* Propor casamento (apenas Pretendente) */}
                  {character.partner.status === 'Pretendente' && (
                    <TouchableOpacity
                      style={[
                        styles.partnerActionBtn,
                        { borderColor: '#c9a84c' },
                        character.partner.relationship < 80 && styles.actionButtonDisabled,
                      ]}
                      activeOpacity={character.partner.relationship >= 80 ? 0.8 : 1}
                      onPress={handlePropose}
                    >
                      <Text style={styles.partnerActionBtnText}>💍 Propor Casamento</Text>
                      <Text style={styles.partnerActionBtnSub}>
                        {character.partner.relationship < 80
                          ? `Requer 80 de relacionamento (atual: ${character.partner.relationship})`
                          : `Custo: ${character.partner.socialClass === 'Camponês' ? 30 : character.partner.socialClass === 'Artesão' ? 150 : 500} 💰`}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Terminar relação */}
                  <TouchableOpacity
                    style={[styles.partnerActionBtn, { borderColor: '#a13a2f' }]}
                    activeOpacity={0.8}
                    onPress={handleBreakup}
                  >
                    <Text style={[styles.partnerActionBtnText, { color: '#ef4444' }]}>💔 Terminar Relação</Text>
                    <Text style={styles.partnerActionBtnSub}>
                      {character.partner.status === 'Esposa' || character.partner.status === 'Esposo'
                        ? '-50 honra (divórcio)'
                        : 'Terminar o cortejo'}
                    </Text>
                  </TouchableOpacity>

                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* ── Child Interaction Modal ──────────────────────────────────── */}
      <ChildInteractionModal
        child={selectedChild}
        playerClass={character.socialClass}
        onClose={() => setSelectedChild(null)}
        onAction={handleChildAction}
      />

      {/* ── Pregnancy Modal ──────────────────────────────────────────── */}
      <PregnancyModal
        isOpen={showPregnancy}
        partnerName={character?.partner?.name ?? ''}
        partnerGender={character?.partner?.gender ?? ''}
        playerGender={character?.gender === 'female' ? 'female' : 'male'}
        onKeep={() => {
          if (!character?.partner) return;
          setCharacter(prev => {
            if (!prev?.partner) return prev;
            return {
              ...prev,
              pendingPregnancy: {
                partnerName: prev.partner.name,
                partnerGender: prev.partner.gender,
                type: tempChildType,
              },
            };
          });
          setShowPregnancy(false);
          closeAndGoHome('🤰 Você decidiu manter o bebê! No próximo ano, uma nova vida chegará.', 'success');
        }}
        onDiscard={() => {
          const discardMsg = `💔 Você decidiu não manter o bebê.`;
          onAddLog?.(discardMsg);
          onAddToLog?.(discardMsg, 'neutral');
          setShowPregnancy(false);
          closeAndGoHome('💔 Você decidiu não manter o bebê.', 'neutral');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  emptyText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },

  // ── Family cards ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  cardDeceased: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  cardRole: {
    fontSize: 12,
    color: COLORS.accent.gold,
    fontWeight: '600',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardAge: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  cardOccupation: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  relationshipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relationshipLabel: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginRight: 8,
  },
  relationshipBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  relationshipBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  relationshipValue: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginLeft: 8,
    width: 35,
    textAlign: 'right',
  },

  // ── Section divider & title ───────────────────────────────────────────────────
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.background.tertiary,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.feedback.error,
    marginBottom: 10,
    letterSpacing: 0.4,
  },

  // ── Enemy list cards ──────────────────────────────────────────────────────────
  enemyCard: {
    backgroundColor: 'rgba(161, 58, 47, 0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.feedback.error,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  enemyEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  enemyInfo: {
    flex: 1,
  },
  enemyName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  enemyAge: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  enemyBadge: {
    backgroundColor: COLORS.feedback.error,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  enemyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },

  // ── Modals ────────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background.secondary,
    padding: 24,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  partnerModalContent: {
    backgroundColor: COLORS.background.secondary,
    padding: 24,
    borderRadius: 12,
    width: '90%',
    maxHeight: '88%',
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 14,
    padding: 4,
    zIndex: 10,
  },
  modalCloseText: {
    fontSize: 20,
    color: COLORS.text.secondary,
  },
  modalActions: {
    width: '100%',
    gap: 10,
  },
  actionGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  actionButton: {
    backgroundColor: COLORS.accent.bronze,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  actionButtonText: {
    color: COLORS.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  actionPreview: {
    color: COLORS.text.secondary,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 3,
    textAlign: 'center',
  },
  hostileButton: {
    backgroundColor: 'rgba(161, 58, 47, 0.35)',
    borderWidth: 1,
    borderColor: COLORS.feedback.error,
  },
  duelButton: {
    backgroundColor: 'rgba(161, 58, 47, 0.5)',
    borderWidth: 2,
    borderColor: COLORS.feedback.error,
  },

  // ── Profile cards ─────────────────────────────────────────────────────────────
  profileCard: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  enemyProfileCard: {
    borderWidth: 1,
    borderColor: COLORS.feedback.error,
  },
  enemyProfileHeader: {
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 8,
  },
  enemyProfileEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  enemyStatsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.feedback.error,
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  profileEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent.gold,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  profileMoney: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: '600',
    marginBottom: 12,
  },
  profileBars: {
    width: '100%',
    gap: 6,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.text.secondary,
    width: 70,
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 11,
    color: COLORS.text.secondary,
    width: 30,
    textAlign: 'right',
  },

  // ── Partner modal ─────────────────────────────────────────────────────────────
  partnerHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  partnerHeaderEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  partnerActions: {
    width: '100%',
    marginBottom: 16,
  },
  partnerActionBtn: {
    backgroundColor: '#1e1e2e',
    borderWidth: 1,
    borderColor: '#c9a84c',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  partnerActionBtnText: {
    color: '#e8d5a3',
    fontSize: 14,
    fontWeight: '600',
  },
  partnerActionBtnSub: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
});
