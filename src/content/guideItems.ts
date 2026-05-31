import { GuideItem } from '../types';
import { commandments } from './commandments';
import { capitalSins } from './capitalSins';

const additionalGuideItems: GuideItem[] = [
  {
    id: 'beatitudes',
    category: 'Bem-aventuranças',
    title: 'Bem-aventuranças',
    explanation:
      'As bem-aventuranças revelam o coração de Cristo: pobreza de espírito, mansidão, pureza, misericórdia, fome de justiça e paz.',
    questions: [
      'Procurei viver com humildade e dependência de Deus?',
      'Fui manso quando contrariado ou respondi com dureza?',
      'Tive misericórdia de quem caiu, ou me apressei em julgar?',
      'Busquei a paz nas relações concretas de hoje?',
    ],
    oppositeVirtue: 'Humildade, misericórdia e mansidão',
    suggestedPropose:
      'Escolher uma bem-aventurança para praticar de modo concreto no dia seguinte.',
  },
  {
    id: 'vida_oracao',
    category: 'Vida de oração',
    title: 'Vida de oração',
    explanation:
      'A oração mantém a alma orientada para Deus. Não é apenas sentimento, mas fidelidade humilde ao encontro com o Senhor.',
    questions: [
      'Reservei tempo real para Deus, mesmo breve?',
      'Rezei com atenção ou deixei a pressa dominar tudo?',
      'Procurei a Palavra de Deus, a Missa ou a adoração quando possível?',
      'Rezei por aqueles que dependem da minha intercessão?',
    ],
    oppositeVirtue: 'Fidelidade e recolhimento',
    suggestedPropose:
      'Definir um horário curto e fixo de oração para amanhã, sem depender da vontade do momento.',
  },
  {
    id: 'familia_noivado',
    category: 'Família/noivado',
    title: 'Família, namoro e noivado',
    explanation:
      'A vida afetiva deve ser lugar de caridade, verdade, respeito e preparação responsável para a vocação.',
    questions: [
      'Fui paciente, presente e honesto com minha família ou com a pessoa amada?',
      'Usei afeto para manipular, controlar ou fugir de conversas difíceis?',
      'Guardei a pureza e o respeito compatíveis com meu estado de vida?',
      'Fui grato pelas pessoas confiadas ao meu cuidado?',
    ],
    oppositeVirtue: 'Caridade doméstica e castidade',
    suggestedPropose:
      'Fazer um gesto concreto de serviço ou reconciliação dentro de casa ou na relação afetiva.',
  },
  {
    id: 'trabalho_deveres',
    category: 'Trabalho/deveres profissionais',
    title: 'Trabalho e deveres profissionais',
    explanation:
      'O trabalho deve ser vivido com justiça, diligência e serviço, sem transformar sucesso ou produtividade em ídolo.',
    questions: [
      'Trabalhei com honestidade e diligência?',
      'Fui justo com colegas, clientes, superiores ou subordinados?',
      'Roubei tempo, recursos ou crédito que não eram meus?',
      'Deixei o trabalho ocupar o lugar de Deus, da família ou do descanso devido?',
    ],
    oppositeVirtue: 'Justiça e diligência',
    suggestedPropose:
      'Identificar uma pendência profissional e resolvê-la com retidão, sem adiar por comodidade.',
  },
  {
    id: 'caridade',
    category: 'Caridade',
    title: 'Caridade',
    explanation:
      'A caridade é o amor de Deus vivido nas relações concretas: atenção, serviço, perdão, generosidade e verdade.',
    questions: [
      'Percebi quem precisava de mim ou permaneci fechado em mim mesmo?',
      'Ajudei alguém de modo concreto, sem buscar reconhecimento?',
      'Fui frio, indiferente ou impaciente com quem sofre?',
      'Rezei e desejei o bem daqueles que me feriram?',
    ],
    oppositeVirtue: 'Amor fraterno',
    suggestedPropose:
      'Praticar uma obra de misericórdia simples e escondida nesta semana.',
  },
  {
    id: 'pureza',
    category: 'Pureza',
    title: 'Pureza',
    explanation:
      'A pureza ordena o olhar, os pensamentos, o corpo e os afetos para que o amor não use o outro como objeto.',
    questions: [
      'Guardei meus olhos e minha imaginação?',
      'Consenti voluntariamente em pensamentos, conversas ou imagens impuras?',
      'Usei telas, redes ou entretenimento de modo que feriu a castidade?',
      'Procurei rapidamente a graça de Deus quando fui tentado?',
    ],
    oppositeVirtue: 'Castidade e domínio de si',
    suggestedPropose:
      'Remover uma ocasião próxima concreta: conteúdo, contato, horário ou hábito que favorece a queda.',
  },
  {
    id: 'tempo_celular',
    category: 'Uso do tempo/celular',
    title: 'Uso do tempo e do celular',
    explanation:
      'O tempo é dom de Deus. O celular deve servir ao bem, não substituir a oração, o descanso, o dever ou a presença aos outros.',
    questions: [
      'Usei o celular sem medida, fugindo de deveres ou de pessoas reais?',
      'Entrei em conteúdos que me afastaram da paz, da pureza ou da caridade?',
      'Troquei silêncio e oração por distração constante?',
      'Fui responsável com horários de sono, estudo, trabalho e família?',
    ],
    oppositeVirtue: 'Temperança e vigilância',
    suggestedPropose:
      'Definir um período sem celular para oração, família ou descanso verdadeiro.',
  },
  {
    id: 'justica_honestidade',
    category: 'Justiça e honestidade',
    title: 'Justiça e honestidade',
    explanation:
      'A justiça dá ao outro o que lhe é devido: verdade, respeito, pagamento, restituição, cumprimento de promessas e cuidado com bens comuns.',
    questions: [
      'Fui honesto em palavras, documentos, trabalho ou negociações?',
      'Devo dinheiro, pedido de desculpas, restituição ou reparação a alguém?',
      'Usei algo alheio sem permissão?',
      'Fui fiel aos compromissos assumidos?',
    ],
    oppositeVirtue: 'Retidão e restituição',
    suggestedPropose:
      'Dar o primeiro passo para reparar uma injustiça concreta, ainda que pequena.',
  },
  {
    id: 'palavras_fofoca_julgamento',
    category: 'Palavras, fofoca e julgamento',
    title: 'Palavras, fofoca e julgamento',
    explanation:
      'A língua pode curar ou ferir. A verdade deve ser dita com caridade, evitando calúnia, difamação, murmuração e julgamentos temerários.',
    questions: [
      'Falei mal de alguém sem necessidade?',
      'Aumentei, distorci ou espalhei fatos que ferem a reputação do próximo?',
      'Julguei intenções sem conhecer o coração da pessoa?',
      'Usei ironia, sarcasmo ou dureza para humilhar?',
    ],
    oppositeVirtue: 'Veracidade, silêncio prudente e benevolência',
    suggestedPropose:
      'Antes de comentar sobre alguém, perguntar se é verdadeiro, necessário e caridoso.',
  },
];

export const guideItems: GuideItem[] = [
  ...commandments,
  ...capitalSins,
  ...additionalGuideItems,
];
