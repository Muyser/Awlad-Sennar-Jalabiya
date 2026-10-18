import Offer from "../models/Offer.js";
import Product from "../models/Product.js";

// @desc    جلب جميع العروض مع بيانات المنتجات المرتبطة (כולل الصور)
// @route   GET /api/offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({})
      .populate("product", "name price images image")
      .sort({ createdAt: -1 });
      
    // تصفية العروض وإرسال التي تحتوي على منتج حقيقي فقط
    const validOffers = offers.filter(o => o.product != null);

    res.status(200).json({ success: true, count: validOffers.length, data: validOffers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    إنشاء عرض جديد
// @route   POST /api/offers
export const createOffer = async (req, res) => {
  try {
    const { name, product, type, value, start, end, active } = req.body;

    // التأكد من أن المنتج موجود في جدول المنتجات
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "المنتج المراد عمل عرض له غير موجود في قاعدة البيانات!" });
    }

    const offer = await Offer.create({
      name,
      product,
      type,
      value,
      start,
      end,
      active: active !== undefined ? (active === "true" || active === true) : true,
    });

    res.status(201).json({ success: true, message: "تم إنشاء العرض بنجاح", data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تعديل عرض
// @route   PUT /api/offers/:id
export const updateOffer = async (req, res) => {
  try {
    let offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "العرض غير موجود" });
    }

    const { name, product, type, value, start, end, active } = req.body;

    // إذا تم إرسال منتج جديد للتعديل، نتحقق من وجوده أولاً
    if (product) {
      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(404).json({ success: false, message: "المنتج الجديد غير موجود في قاعدة البيانات!" });
      }
      offer.product = product;
    }

    if (name) offer.name = name;
    if (type) offer.type = type;
    if (value) offer.value = value;
    if (start) offer.start = start;
    if (end) offer.end = end;
    if (active !== undefined) {
      offer.active = active === "true" || active === true;
    }

    const updatedOffer = await offer.save();

    res.status(200).json({ 
      success: true, 
      message: "تم تحديث العرض بنجاح", 
      data: updatedOffer 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف عرض
// @route   DELETE /api/offers/:id
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "العرض غير موجود" });
    }

    await offer.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف العرض بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};