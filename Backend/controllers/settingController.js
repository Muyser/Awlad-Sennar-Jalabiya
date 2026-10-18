import Setting from "../models/Setting.js";

// @desc    جلب إعدادات المتجر
// @route   GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({});
    // إذا لم تكن الإعدادات موجودة مسبقاً، نقوم بتخلق إعدادات افتراضية
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تحديث إعدادات المتجر (إنشاء أو تعديل)
// @route   PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({}); 
    
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "تم حفظ الإعدادات بنجاح", 
      data: settings 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};