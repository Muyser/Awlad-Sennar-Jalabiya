export const WHATSAPP_NUMBER = "250787613212";
export const WHATSAPP_DISPLAY = "+250 795 053 413";
export const PHONE_DISPLAY = "+250 787 613 212";
export const PHONE_TEL = "250795053413";
export const ADDRESS = "كيميرونكو جوار KFC، كيغالي، رواندا";

export const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const NAV_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/products" },
  { label: "الأقسام", href: "/categories" },
  { label: "التفصيل", href: "/tailoring-order" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
];

export const CATEGORIES = [
  "جلاليب سودانية",
  "جلاليب خليجية",
  "جلاليب تشادية",
  "جانفو",
  "لبسات أفريقية",
  "عمم",
  "شالات",
  "طواقي",
  "أحذية",
  "عطور",
  "سديري",
  "سراويل",
];

export const IMG = {
  hero: "/__generating__/e3bffa73-ed47-4667-a42a-2f05cf557cb9.png",
  sudanese: "/__generating__/38337464-8a79-4c1a-893c-5ebc3522a473.png",
  gulf: "/__generating__/ace4b652-4a03-4da6-ab72-54cb10eb1300.png",
  chadian: "/__generating__/88b249d5-249a-432c-8d56-c37a0bdd98b4.png",
  african: "/__generating__/ede56119-bd92-4ee1-a5dc-49310b377d5b.png",
  atelier: "/__generating__/2c6e46d8-a168-4df9-9a6e-8c7679085ca9.png",
  about: "/__generating__/084bfe55-efc5-44c8-81b5-0cc2aa637139.png",
  burgundy: "/__generating__/3a4a96c1-4c64-42f8-abcc-988654e6a028.png",
  navy: "/__generating__/176221fd-2347-4d8b-808f-37d00c1eab5e.png",
  turbans: "/__generating__/f0ce3d80-f918-4916-8e8f-54758c0e9478.png",
  cream: "/__generating__/76d667cb-6786-4288-ad3e-a97dd8f8566c.png",
  green: "/__generating__/6dc4672b-e778-4982-b8bf-5e459a2ee008.png",
};