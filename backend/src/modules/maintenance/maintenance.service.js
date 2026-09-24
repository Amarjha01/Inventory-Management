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

  async updateService(serviceId, serviceData, userId) {
    const updated =  await maintenanceRepository.updateService(
    serviceId,
    serviceData,
    userId
  );
  console.log("updated " , updated);
  
  return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Service
  |--------------------------------------------------------------------------
  */

  async deleteService(serviceId) {
    console.log(serviceId);
    
    return await maintenanceRepository.deleteService(
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

  async deleteVisitor( visitorId) {
    return await maintenanceRepository.deleteVisitor(
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

 async updatePurchaseRecord(userId, purchaseId, purchaseData, files) {
  return await maintenanceRepository.updatePurchaseRecord(
    userId,
    purchaseId,
    purchaseData,
    files
  );
}

  /*
  |--------------------------------------------------------------------------
  | Delete Purchase Record
  |--------------------------------------------------------------------------
  */

  async deletePurchaseRecord(
    purchaseId
  ) {
    return await maintenanceRepository.deletePurchaseRecord(
      purchaseId
    );
  }
}

export default new MaintenanceService();