/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 8. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Hangi üçgen dik açılı?', en: 'Which triangles have a right angle?',
      note: 'Kenarlarına bakarak bir üçgenin dik açılı olup olmadığını anlayabilir miyiz? Varsayalım: kenarların kareleri arasında bir ilişki var.' },
    { scene: 2, start: 10.8, end: 19.2, tr: 'Kenarlara kareler', en: 'Squares on the sides',
      note: 'Kenarları 3, 4 ve 5 olan üçgenin her kenarına bir kare çizelim. Karelerde 9, 16 ve 25 birim kare var.' },
    { scene: 2, start: 19.4, end: 27.8, tr: '9 + 16 = 25', en: '9 + 16 = 25',
      note: 'İki küçük karenin toplamı büyük kareye eşit: 3 kare artı 4 kare, 5 kare. Ve C açısı tam 90 derece: üçgen dik açılı.' },
    { scene: 3, start: 28.8, end: 34.2, tr: 'Ondalıklı kenarlar', en: 'Decimal sides',
      note: 'Kenarlar 1,5; 2 ve 2,5 olsun. 2,25 artı 4, 6,25; bu da 2,5 in karesi. Rasyonel sayılar da eşitliği sağlar.' },
    { scene: 3, start: 34.4, end: 45.8, tr: '5, 12, 13 ve 2, 3, 4', en: '5, 12, 13 and 2, 3, 4',
      note: '25 artı 144, 169; 13 ün karesi, üçgen dik. 2, 3, 4 te ise 4 artı 9, 13; 16 değil. Bu üçgenin C açısı 90 dereceden büyük.' },
    { scene: 4, start: 46.8, end: 55.0, tr: 'Açı daralınca', en: 'A narrower angle',
      note: '3 ve 4 kenarlarını sabit tutup aradaki C açısını daraltalım. Karşısındaki kenar kısalıyor: c kare 25 ten küçük.' },
    { scene: 4, start: 55.2, end: 63.8, tr: 'Açı genişleyince', en: 'A wider angle',
      note: 'Açıyı genişletelim: c uzuyor, c kare 25 i geçiyor. Büyük açının karşısında büyük kenar. Yine de c, 3 artı 4 ten kısa kalıyor.' },
    { scene: 5, start: 64.8, end: 72.0, tr: 'Dar açılı üçgen', en: 'An acute triangle',
      note: 'En uzun kenarı c alalım. 4, 5, 6: 36, 41 den küçük; üçgen dar açılı.' },
    { scene: 5, start: 72.2, end: 79.8, tr: 'Geniş açılı üçgen', en: 'An obtuse triangle',
      note: '3, 5, 7: 49, 34 ten büyük; üçgen geniş açılı. Eşitse dik, küçükse dar, büyükse geniş.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Eşit, küçük, büyük', en: 'Equal, less, greater',
      note: 'Aklında kalsın: dik üçgende dik kenarların kareleri toplamı hipotenüsün karesine eşittir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'a² + b² = c²!', en: 'a² + b² = c²!',
      note: 'Karelerin toplamı: Pisagor bağıntısı!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
