class tool extends Object {
    _id
    serialNumber: String
    partNumber: String
    barcode: string
    description: string
    serviceAssignment: String
    status: String
}

class user extends Object {
    _id: String // ObjectId, auto-generated
email: String
hash: String
salt: String
firstName: String
lastName: String
createdOn: Date
updatedOn: Date
lastLogin: Date
isDisabled: boolean
role: String

}