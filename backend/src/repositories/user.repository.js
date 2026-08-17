import User from "../models/user.js";

class UserRepository {
  async updateMany(){
    return await User.updateMany(
      {},
      {$set:{isFirstLogin:true}}
    )
  }

  async create(payload) {
    return await User.create(payload);
  }

  async findMany(filter = {}) {
    return await User.find(filter)
      .populate("kitchenId")
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  async findAll() {
    return await User.find().populate("kitchenId").lean();
  }
  async findById(id) {
    return await User.findById(id).populate("kitchenId").lean();
  }

  async findByIdWithPassword(id) {

    return await User.findById(id)
        .select("+password");
}

  async findByPhone(phone) {
    return await User.findOne({
      phone,
    })
      .select("+password")
      .populate("kitchenId");
  }

  async update(id, payload) {
    return await User.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,
        runValidators: true,
      },
    )
      .populate("kitchenId")
      .lean();
  }

  async activate(id) {
    return await User.findByIdAndUpdate(
      id,

      {
        isActive: true,
      },

      {
        new: true,
      },
    ).lean();
  }

  async deactivate(id) {
    return await User.findByIdAndUpdate(
      id,

      {
        isActive: false,
      },

      {
        new: true,
      },
    ).lean();
  }
}



export default new UserRepository();
