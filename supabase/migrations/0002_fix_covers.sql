-- Correct mismatched/broken cover images from 0001 seed

update public.books set cover_url = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop' where title = 'Bagh-o-Bahar';
update public.books set cover_url = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop' where title = 'Diwan-e-Ghalib';
update public.books set cover_url = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop' where title = 'Muqaddama-e-Sher-o-Shayari';
update public.books set cover_url = 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=600&auto=format&fit=crop' where title = 'Firdaus-i-Tavarikh Manuscript';
update public.books set cover_url = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop' where title = 'Journal of South Asian Literature';
update public.books set cover_url = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop' where title = 'Urdu Criticism 1950-2000';
update public.books set cover_url = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop' where title = 'Colonial Punjab Land Records';
update public.books set cover_url = 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=600&auto=format&fit=crop' where title = 'Kulliyat-e-Iqbal';
