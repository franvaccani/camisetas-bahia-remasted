// Define proper types for category structure
export interface SubSubSubCategory {
  id: string;
  name: string;
}

export interface SubSubCategory {
  id: string;
  name: string;
  subcategories?: SubSubSubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  subcategories?: SubSubCategory[];
  subItems?: string[];
}

export interface Category {
  id: string;
  name: string;
  subcategories?: SubCategory[];
}

export const categories: Category[] = [
  {
    id: 'adulto',
    name: 'Adulto',
    subcategories: [
      {
        id: 'futbol',
        name: 'Fútbol',
        subcategories: [
          {
            id: 'bermudas',
            name: 'Bermudas'
          },
          {
            id: 'camisetas',
            name: 'Camisetas',
            subcategories: [
              { id: 'clubes-internacionales', name: 'Clubes Internacionales' },
              { id: 'clubes-nacionales', name: 'Clubes Nacionales' },
              { id: 'selecciones-nacionales', name: 'Selecciones Nacionales' }
            ]
          },
          {
            id: 'camisetas-retro',
            name: 'Camisetas Retro',
            subcategories: [
              { id: 'retro-clubes-internacionales', name: 'Clubes Internacionales' },
              { id: 'retro-clubes-nacionales', name: 'Clubes Nacionales' },
              { id: 'retro-selecciones-nacionales', name: 'Selecciones Nacionales' }
            ]
          },
          {
            id: 'camperas-buzos',
            name: 'Camperas y Buzos',
            subcategories: [
              { id: 'afa', name: 'AFA' },
              { id: 'internacional', name: 'Internacional' },
              { id: 'nacional', name: 'Nacional' }
            ]
          },
          {
            id: 'chombas',
            name: 'Chombas',
            subcategories: [
              { id: 'chombas-clubes', name: 'Clubes' },
              { id: 'chombas-selecciones', name: 'Selecciones' }
            ]
          },
          {
            id: 'chupines-entrenamiento',
            name: 'Chupines Entrenamiento'
          },
          {
            id: 'entrenamiento',
            name: 'Entrenamiento',
            subcategories: [
              { id: 'conjuntos', name: 'Conjuntos' },
              { id: 'remeras', name: 'Remeras' },
              { id: 'shorts', name: 'Shorts' }
            ]
          },
          {
            id: 'remeras-algodon',
            name: 'Remeras Algodón',
            subcategories: [
              { id: 'algodon-clubes-internacionales', name: 'Clubes Internacionales' },
              { id: 'algodon-clubes-nacionales', name: 'Clubes Nacionales' }
            ]
          },
          {
            id: 'shorts',
            name: 'Shorts'
          }
        ]
      },
      {
        id: 'basquet',
        name: 'Básquet',
        subcategories: [
          { id: 'basquet-bermudas', name: 'Bermudas' },
          { id: 'basquet-buzos', name: 'Buzos' },
          { id: 'basquet-camperas', name: 'Camperas' },
          { id: 'basquet-chupines', name: 'Chupines' },
          { id: 'basquet-gorras', name: 'Gorras' },
          {
            id: 'basquet-musculosas',
            name: 'Musculosas',
            subcategories: [
              { id: 'apliques', name: 'Apliques' },
              { id: 'calidad-original', name: 'Calidad Original' },
              { id: 'replicas', name: 'Replicas' },
              { id: 'sublimadas', name: 'Sublimadas' }
            ]
          },
          { id: 'basquet-remeras-algodon', name: 'Remeras Algodón' }
        ]
      }
    ]
  },
  {
    id: 'nino',
    name: 'Niño',
    subcategories: [
      { id: 'nino-basquet', name: 'Básquet' },
      { id: 'nino-futbol', name: 'Fútbol' },
      { id: 'nino-merchandising', name: 'Merchandising' }
    ]
  }
];