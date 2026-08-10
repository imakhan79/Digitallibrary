export type Resource = {
  id: string;
  title: string;
  author: string;
  category: string;
  resourceType: "book" | "manuscript" | "journal" | "thesis" | "archive";
  language: string;
  year: number;
  cover: string;
  description: string;
};

export const sampleResources: Resource[] = [
  { id: "1", title: "Bagh-o-Bahar", author: "Mir Amman", category: "Classical Fiction", resourceType: "book", language: "Urdu", year: 1804, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop", description: "One of the earliest and most celebrated works of Urdu prose fiction." },
  { id: "2", title: "Diwan-e-Ghalib", author: "Mirza Ghalib", category: "Poetry", resourceType: "book", language: "Urdu", year: 1841, cover: "https://images.unsplash.com/photo-1583468982228-19f19164aee2?q=80&w=600&auto=format&fit=crop", description: "The definitive collection of ghazals by the master poet Mirza Ghalib." },
  { id: "3", title: "Muqaddama-e-Sher-o-Shayari", author: "Altaf Hussain Hali", category: "Literary Criticism", resourceType: "book", language: "Urdu", year: 1893, cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop", description: "A foundational text of modern Urdu literary criticism." },
  { id: "4", title: "Firdaus-i-Tavarikh Manuscript", author: "Unknown Scribe", category: "Historical Manuscripts", resourceType: "manuscript", language: "Persian", year: 1650, cover: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=600&auto=format&fit=crop", description: "A richly illuminated Persian chronicle preserved for centuries." },
  { id: "5", title: "Journal of South Asian Literature", author: "Various Authors", category: "Academic Journals", resourceType: "journal", language: "English", year: 1998, cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop", description: "Peer-reviewed research on South Asian literary traditions." },
  { id: "6", title: "Urdu Criticism 1950–2000", author: "Dr. Jameel Jalibi", category: "Research", resourceType: "thesis", language: "Urdu", year: 1985, cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop", description: "A landmark doctoral thesis surveying five decades of Urdu criticism." },
  { id: "7", title: "Colonial Punjab Land Records", author: "Punjab Archive Board", category: "Archives", resourceType: "archive", language: "English", year: 1912, cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop", description: "Preserved administrative records from colonial-era Punjab." },
  { id: "8", title: "Kulliyat-e-Iqbal", author: "Allama Iqbal", category: "Poetry", resourceType: "book", language: "Urdu", year: 1935, cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=600&auto=format&fit=crop", description: "The complete poetic works of the philosopher-poet Allama Iqbal." },
];

export const collections = [
  { title: "Urdu Literary Heritage", description: "Foundational works of Urdu prose and poetry.", count: 1240, language: "Urdu", image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop" },
  { title: "Rare Urdu Books", description: "First editions and out-of-print treasures.", count: 386, language: "Urdu", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" },
  { title: "Historical Manuscripts", description: "Hand-copied works spanning four centuries.", count: 512, language: "Persian / Arabic", image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=800&auto=format&fit=crop" },
  { title: "Research Collections", description: "Theses and journals from leading scholars.", count: 2210, language: "English / Urdu", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop" },
];

export const discoveryCards = [
  { key: "books", type: "book", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop" },
  { key: "manuscripts", type: "manuscript", image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=800&auto=format&fit=crop" },
  { key: "journals", type: "journal", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop" },
  { key: "theses", type: "thesis", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop" },
  { key: "archives", type: "archive", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" },
  { key: "rareBooks", type: "rare", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" },
];
