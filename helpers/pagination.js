module.exports = (objectPagination,query,itemTotal)=>{
    
       if(query.page){
        objectPagination.currentPage = parseInt(query.page)
       }
       if(query.limit){
        objectPagination.limitItem = parseInt(query.limit)
       }
       objectPagination.skip = (objectPagination.currentPage -1)*objectPagination.limitItem;
      
       objectPagination.totalPage =  Math.ceil(itemTotal / objectPagination.limitItem);
       return objectPagination;
}