
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'doritos-nacho',
    name: 'Doritos Queijo Nacho',
    description: 'A tortilha de milho mais famosa do mundo com sabor intenso de queijo.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/salgadinho_doritos_queijo_nacho_140g_elma_chips_341_1_20200813151833.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-d1', name: '48g', price: 6.50, isActive: true },
      { id: 'v-d2', name: '140g', price: 15.90, isActive: true }
    ]
  },
  {
    id: 'doritos-sweet-chili',
    name: 'Doritos Sweet Chili',
    description: 'O equilíbrio perfeito entre o doce e o picante.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/salgadinho_doritos_sweet_chili_140g_elma_chips_349_1_20200813151834.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-dsc1', name: '48g', price: 6.50, isActive: true },
      { id: 'v-dsc2', name: '140g', price: 15.90, isActive: true }
    ]
  },
  {
    id: 'fandangos-queijo',
    name: 'Fandangos Queijo',
    description: 'Salgadinho de milho assado sabor queijo, crocante e delicioso.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/salgadinho_fandangos_queijo_elma_chips_59g_345_1_20200813151833.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-fq1', name: '59g', price: 6.50, isActive: true },
      { id: 'v-fq2', name: '140g', price: 13.50, isActive: true }
    ]
  },
  {
    id: 'cheetos-lua',
    name: 'Cheetos Lua Parmesão',
    description: 'O clássico formato de lua com um sabor irresistível de parmesão.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/salgadinho_cheetos_lua_elma_chips_59g_337_1_20200813151832.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-cl1', name: '37g', price: 3.50, isActive: true },
      { id: 'v-cl2', name: '59g', price: 6.50, isActive: true }
    ]
  },
  {
    id: 'cheetos-mix',
    name: 'Cheetos Mix de Queijos',
    description: 'Uma mistura explosiva de formatos e sabores de queijo.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/salgadinho_cheetos_mix_elma_chips_59g_339_1_20200813151832.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-cm1', name: '59g', price: 6.50, isActive: true }
    ]
  },
  {
    id: 'cheetos-familia',
    name: 'Cheetos Família Sabores',
    description: 'Pacote tamanho família para compartilhar com todo mundo.',
    image: 'https://static.paodeacucar.com/img/uploads/1/748/24128748.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-cf1', name: '140g', price: 13.90, isActive: true }
    ]
  },
  {
    id: 'pingo-bacon',
    name: 'Pingo de Ouro Bacon',
    description: 'Salgadinho de trigo com o defumado perfeito do bacon.',
    image: 'https://images.tcdn.com.br/img/img_prod/1169992/salgadinho_pingo_de_ouro_bacon_60g_399_1_41935e80c9a13881486bf3a4a7857a35.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-pb1', name: '60g', price: 6.90, isActive: true }
    ]
  },
  {
    id: 'pingo-picanha',
    name: 'Pingo de Ouro Picanha',
    description: 'O sabor do churrasco brasileiro em cada mordida.',
    image: 'https://images.tcdn.com.br/img/img_prod/1169992/salgadinho_pingo_de_ouro_picanha_60g_400_1_41936e80c9a13881486bf3a4a7857a35.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-pp1', name: '60g', price: 6.90, isActive: true }
    ]
  },
  {
    id: 'batata-sensacoes',
    name: 'Batata Sensações',
    description: 'Cortes finos e crocantes com sabores sofisticados.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/batata_chips_sensacoes_frango_grelhado_elma_chips_45g_359_1_20200813151834.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-bs1', name: '45g', price: 5.50, isActive: true },
      { id: 'v-bs2', name: '80g', price: 9.90, isActive: true }
    ]
  },
  {
    id: 'ruffles-tubo',
    name: 'Ruffles Megatubo',
    description: 'A batata Ruffles no formato prático de tubo.',
    image: 'https://images.tcdn.com.br/img/img_prod/1169992/salgadinho_ruffles_tubo_original_115g_402_1_c737f2a0c9a33881486cf3a4a7867a35.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-rt1', name: '115g', price: 14.50, isActive: true }
    ]
  },
  {
    id: 'yokitos-sabores',
    name: 'Yokitos Sabores',
    description: 'O salgadinho divertido da Yoki para todas as idades.',
    image: 'https://static.paodeacucar.com/img/uploads/1/900/24076900.jpg',
    category: 'Salgados',
    isActive: true,
    variants: [
      { id: 'v-y1', name: '45g', price: 3.50, isActive: true }
    ]
  },
  {
    id: 'lays-sabores',
    name: 'Lay\'s Sabores',
    description: 'Batatas selecionadas nos sabores Salt, Sour Cream e outros.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/batata_chips_lays_classica_80g_elma_chips_343_1_20200813151833.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-ls1', name: '45g', price: 5.50, isActive: true },
      { id: 'v-ls2', name: '80g', price: 9.90, isActive: true }
    ]
  },
  {
    id: 'lanchinho',
    name: 'Lanchinho Elma Chips',
    description: 'O kit perfeito com variados salgadinhos pequenos.',
    image: 'https://images.tcdn.com.br/img/img_prod/1169992/kit_lanchinho_elma_chips_pacote_com_10_unidades_404_1_c737f2a0c9a53881486df3a4a787a35.jpg',
    category: 'Elma Chips',
    isActive: true,
    variants: [
      { id: 'v-lc1', name: 'Pacote 10un', price: 24.90, isActive: true }
    ]
  },
  {
    id: 'batata-palha',
    name: 'Batata Palha Yoki',
    description: 'Acompanhamento crocante para seu strogonoff ou lanches.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/batata_palha_yoki_tradicional_105g_877_1_20200813152011.jpg',
    category: 'Salgados',
    isActive: true,
    variants: [
      { id: 'v-bp1', name: '105g', price: 7.50, isActive: true },
      { id: 'v-bp2', name: '140g', price: 9.90, isActive: true }
    ]
  },
  {
    id: 'torrao-doce-mel',
    name: 'Torrão Doce Mel',
    description: 'Doce tradicional de amendoim, macio e saboroso.',
    image: 'https://static.paodeacucar.com/img/uploads/1/365/22419365.jpg',
    category: 'Doces',
    isActive: true,
    variants: [
      { id: 'v-tdm1', name: 'Unidade', price: 1.50, isActive: true },
      { id: 'v-tdm2', name: 'Pacote 10un', price: 12.00, isActive: true }
    ]
  },
  {
    id: 'mandolate-doce-mel',
    name: 'Mandolate Doce Mel',
    description: 'O clássico mandolate com mel e amendoim.',
    image: 'https://m.media-amazon.com/images/I/51r2Xb3fU0L._AC_.jpg',
    category: 'Doces',
    isActive: true,
    variants: [
      { id: 'v-mdm1', name: 'Unidade', price: 2.00, isActive: true }
    ]
  },
  {
    id: 'amendoim-doce-mel',
    name: 'Amendoim Doce Mel',
    description: 'Amendoim japonês ou torrado de alta qualidade.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/amendoim_japones_elma_chips_mendorato_145g_341_1_20200813151833.jpg',
    category: 'Salgados',
    isActive: true,
    variants: [
      { id: 'v-adm1', name: '40g', price: 2.50, isActive: true },
      { id: 'v-adm2', name: '145g', price: 8.50, isActive: true }
    ]
  },
  {
    id: 'bala-fini',
    name: 'Bala Fini Sabores',
    description: 'Tubes, Minhocas ou Ursos. O mundo Fini em suas mãos.',
    image: 'https://images.tcdn.com.br/img/img_prod/1169992/bala_fini_tubes_morango_citrico_80g_405_1_c737f2a0c9a63881486ef3a4a788a35.jpg',
    category: 'Doces',
    isActive: true,
    variants: [
      { id: 'v-bf1', name: '80g', price: 6.90, isActive: true },
      { id: 'v-bf2', name: '100g', price: 7.90, isActive: true }
    ]
  },
  {
    id: 'toddynho',
    name: 'Toddynho',
    description: 'Achocolatado pronto para beber. Sabor que acompanha gerações.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/achocolatado_toddynho_tradicional_200ml_873_1_20200813152011.jpg',
    category: 'PepsiCo',
    isActive: true,
    variants: [
      { id: 'v-t1', name: '200ml', price: 3.50, isActive: true }
    ]
  },
  {
    id: 'kero-coco',
    name: 'Kero Coco',
    description: 'Água de coco 100% natural, vinda direto do coco para você.',
    image: 'https://images.tcdn.com.br/img/img_prod/697711/agua_de_coco_kero_coco_330ml_875_1_20200813152011.jpg',
    category: 'PepsiCo',
    isActive: true,
    variants: [
      { id: 'v-k1', name: '330ml', price: 4.50, isActive: true },
      { id: 'v-k2', name: '1 Litro', price: 11.90, isActive: true }
    ]
  }
];

export const CATEGORIES = ['Todas', 'Elma Chips', 'Bebidas', 'Doces', 'Salgados', 'Pipocas', 'PepsiCo'];
