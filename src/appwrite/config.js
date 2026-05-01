import { Client, ID, Permission, Query, Role, Storage, TablesDB } from "appwrite";
import conf from '../conf/conf.js';


export class Service{
    client = new Client();
    tablesDB;
    storage;
    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.tablesDB = new TablesDB(this.client);
        this.storage = new Storage(this.client);
    }
    async createPost({title, slug, content, featuredImage, status, userId, authorName}){
        try{
            return await this.tablesDB.createRow(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    authorName,
                },
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(userId)),
                    Permission.delete(Role.user(userId))
                ]
            );
        } catch(error){
            throw error
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.tablesDB.updateRow(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }

            )
        } catch(error) {
            throw error;
        }
    }

    async updateAuthorNameInPosts(userId, newAuthorName) {
        try {
            const result = await this.tablesDB.listRows(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                [Query.equal("userId", userId)]
            );
            
            const promises = (result?.rows || []).map(post => 
                this.tablesDB.updateRow(
                    conf.appwriteDatabaseId,
                    conf.appwriteTableId,
                    post.$id,
                    { authorName: newAuthorName }
                )
            );
            
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error("Failed to update post author names:", error);
            throw error;
        }
    }

    async deletePost(slug){
        try{
            await this.tablesDB.deleteRow(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                slug
            )
            return true
        } catch(error){
            throw error;
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.tablesDB.getRow(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                slug
            )
        } catch(error) {
            throw error;
            return false
        }
    }

    async getPosts(queries = [Query.equal("status","active")]){
        try{
            return await this.tablesDB.listRows(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                queries,
            )
        } catch(error) {
            throw error;
            return false
        }
    }

    //file upload services

    async uploadFile(file, userId){
        try{
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(userId)),
                    Permission.delete(Role.user(userId))
                ]
            )
        } catch(error){
            throw error;
            return false
        }
    }

    async deleteFile(fileId){
        try{
            await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch(error){
            throw error;
            return false
        }
    }

    getFilePreview(fileId){
        if (!fileId) return "";

        const fileView = this.storage.getFileView(
            conf.appwriteBucketId,
            fileId
        )

        return fileView.toString()
    }
}


const service = new Service()
export default service