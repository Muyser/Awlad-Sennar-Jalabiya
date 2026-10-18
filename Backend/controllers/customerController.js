import Customer from "../models/Customer.js";

// @desc    جلب جميع العملاء
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    جلب عميل محدد بواسطة الـ ID
// @route   GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "العميل غير موجود" });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    إضافة عميل جديد
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, sizes, orders, spent, paid, remaining } = req.body;

    // التحقق مما إذا كان رقم الهاتف مسجلاً مسبقاً
    const customerExists = await Customer.findOne({ phone });
    if (customerExists) {
      return res.status(400).json({ success: false, message: "رقم الهاتف مسجل بالفعل لعميل آخر!" });
    }

    const customer = await Customer.create({
      name,
      phone,
      sizes: sizes || "غير محدد",
      orders: orders !== undefined ? Number(orders) : 0,
      spent: spent !== undefined ? Number(spent) : 0,
      paid: paid !== undefined ? Number(paid) : 0,
      remaining: remaining !== undefined ? Number(remaining) : 0,
    });

    res.status(201).json({ success: true, message: "تم إضافة العميل بنجاح", data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تعديل بيانات عميل
// @route   PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "العميل غير موجود" });
    }

    const { name, phone, sizes, orders, spent, paid, remaining } = req.body;

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (sizes) customer.sizes = sizes;
    if (orders !== undefined) customer.orders = orders;
    if (spent !== undefined) customer.spent = spent;
    if (paid !== undefined) customer.paid = paid;
    if (remaining !== undefined) customer.remaining = remaining;

    const updatedCustomer = await customer.save();

    res.status(200).json({ 
      success: true, 
      message: "تم تحديث بيانات العميل بنجاح", 
      data: updatedCustomer 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف عميل
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "العميل غير موجود" });
    }

    await customer.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف العميل بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};