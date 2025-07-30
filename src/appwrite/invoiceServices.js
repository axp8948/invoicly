// src/appwrite/invoiceService.js
import { Client, Databases, ID, Query } from "appwrite";
import conf from "../conf/conf";

class InvoiceService {
  client = new Client();
  databases;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async createInvoice({ invoiceNumber, date, company, amount, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteInvoiceId,
        ID.unique(),
        { invoiceNumber, date, company, amount, status, userId }
      );
    } catch (error) {
      console.error("createInvoice error:", error);
      throw error;
    }
  }

  async getInvoices(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteInvoiceId,
        [Query.equal("userId", userId)]
      );
    } catch (error) {
      console.error("getInvoices error:", error);
      return [];
    }
  }

  async updateInvoice(id, updatedFields) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteInvoiceId,
        id,
        updatedFields
      );
    } catch (error) {
      console.error("updateInvoice error:", error);
      throw error;
    }
  }

  async deleteInvoice(id) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteInvoiceId,
        id
      );
    } catch (error) {
      console.error("deleteInvoice error:", error);
      throw error;
    }
  }
}

const invoiceService = new InvoiceService();
export default invoiceService;
