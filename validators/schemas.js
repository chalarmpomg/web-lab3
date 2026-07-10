const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'กรุณากรอกชื่อ',
    'string.min': 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร',
    'any.required': 'กรุณากรอกชื่อ',
  }),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'กรุณากรอกอีเมล',
    'string.email': 'รูปแบบอีเมลไม่ถูกต้อง',
    'any.required': 'กรุณากรอกอีเมล',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'กรุณากรอกรหัสผ่าน',
    'string.min': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    'any.required': 'กรุณากรอกรหัสผ่าน',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'รหัสผ่านไม่ตรงกัน',
    'any.required': 'กรุณายืนยันรหัสผ่าน',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'กรุณากรอกอีเมล',
    'string.email': 'รูปแบบอีเมลไม่ถูกต้อง',
    'any.required': 'กรุณากรอกอีเมล',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'กรุณากรอกรหัสผ่าน',
    'any.required': 'กรุณากรอกรหัสผ่าน',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
