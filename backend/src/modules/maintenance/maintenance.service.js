import maintenanceRepository from "./maintenance.repository.js";

class MaintenanceService {

  async findAllForAdmin(filter) {
    return await maintenanceRepository.findAllForAdmin(filter);
  }

  
  /*
  |--------------------------------------------------------------------------
  | Find maintenance document
  |--------------------------------------------------------------------------
  */

  async findByUserId(userId , filter) {
    return await maintenanceRepository.findByUserId(
      userId,
      filter
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create maintenance document
  |--------------------------------------------------------------------------
  */

  async create(data) {
    console.log("data at maintenance service" , data);
    
    return await maintenanceRepository.create(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Add Service
  |--------------------------------------------------------------------------
  */

  async addService(userId, serviceData) {
    return await maintenanceRepository.addService(
      userId,
      serviceData
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Service
  |--------------------------------------------------------------------------
  */

  async updateService(
    userId,
    serviceId,
    serviceData
  ) {
    return await maintenanceRepository.updateService(
      userId,
      serviceId,
      serviceData
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Service
  |--------------------------------------------------------------------------
  */

  async deleteService(userId, serviceId) {
    return await maintenanceRepository.deleteService(
      userId,
      serviceId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Add Visitor
  |--------------------------------------------------------------------------
  */

  async addVisitor(data) {
    return await maintenanceRepository.addVisitor(
      data
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Visitor
  |--------------------------------------------------------------------------
  */

  async updateVisitor(
    userId,
    visitorId,
    visitorData,
    images
  ) {
    return await maintenanceRepository.updateVisitor(
      userId,
      visitorId,
      visitorData,
      images
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Visitor
  |--------------------------------------------------------------------------
  */

  async deleteVisitor(userId, visitorId) {
    return await maintenanceRepository.deleteVisitor(
      userId,
      visitorId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Add Purchase Record
  |--------------------------------------------------------------------------
  */

  async addPurchaseRecord(data) {
    return await maintenanceRepository.addPurchaseRecord(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Purchase Record
  |--------------------------------------------------------------------------
  */

  async updatePurchaseRecord(
    userId,
    purchaseId,
    purchaseData
  ) {
    return await maintenanceRepository.updatePurchaseRecord(
      userId,
      purchaseId,
      purchaseData
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Purchase Record
  |--------------------------------------------------------------------------
  */

  async deletePurchaseRecord(
    userId,
    purchaseId
  ) {
    return await maintenanceRepository.deletePurchaseRecord(
      userId,
      purchaseId
    );
  }
}

export default new MaintenanceService();