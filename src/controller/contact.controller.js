import { contactModel } from "../model/contact.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendContactMail } from "../utils/nodeMailer.js";

export const contact = asyncHandler(async (req, res) => {
  const { name, mobile, email, message } = req.body;

  if (!name && !mobile && !email && !message) {
    return res
      .status(500)
      .json({ status: false, message: "Incomplete form data" });
  }

  await sendContactMail({ name, mobile, email, message });
  const contact = await contactModel.create({ name, mobile, email, message });

  res
    .status(200)
    .json({ status: true, message: "Contact mail sent successfully" });
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const limit = req?.query?.limit || 12;
  const page = req?.query?.page || 1;
  const skip = (page - 1) * limit;
  let totalPages = 1;

  const totalItems = await contactModel.countDocuments();
  totalPages = Math.ceil(totalItems / limit);

  const result = await contactModel.find().skip(skip).limit(limit);

  res.status(200).json({ status: true, totalPages, data: result });
});



export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if(!id){
    res.status(500).json({status: false, message: 'Missing ID'})
  }
  const isIdValid = await contactModel.findByIdAndDelete(id);
  if (!isIdValid) {
    return res
      .status(400)
      .json({ status: false, messaeg: "No Data found with given id!!" });
  }

  res.status(200).json({ status: true, message: "Deleted successfully" });
});