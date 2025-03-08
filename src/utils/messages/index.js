

const generateMessage=(entity)=>({
    notFound:`${entity} not found`,
    alreadyExist:`${entity} already exist`,
    createdSuccessfully:`${entity}created successfully`,
    updatedSuccessfully:`${entity} updated successfully`,
    deletedSuccessfully:`${entity} deleted successfully`,
    failToCreate: `fail to create ${entity}`,
    failToUpdate: `fail to Update ${entity}`,
    failToDelete: `fail to Delete ${entity}`     
})
export const messages={
    user:{...generateMessage("user"),incorrectPassword:"incorrect password"},
    message:generateMessage("message"),
    product:generateMessage('product'),
    category:generateMessage("category"),
    brand:generateMessage("brand")
}