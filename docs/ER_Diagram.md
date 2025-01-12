graph TD
    %% User Entity and Attributes
    User[User]
    UserID((ID))
    UserName((Name))
    UserEmail((Email))
    UserPassword((Password))
    UserVerified((Verified))
    User --- UserID
    User --- UserName
    User --- UserEmail
    User --- UserPassword
    User --- UserVerified

    %% Product Entity and Attributes
    Product[Product]
    ProductID((ID))
    ProductName((Name))
    ProductCategory((Category))
    ProductPrice((Price))
    ProductImage((Image))
    ProductStock((Stock))
    Product --- ProductID
    Product --- ProductName
    Product --- ProductCategory
    Product --- ProductPrice
    Product --- ProductImage
    Product --- ProductStock

    %% Customer Entity and Attributes
    Customer[Customer]
    CustomerID((ID))
    CustomerName((Name))
    CustomerPhone((Phone))
    CustomerAddress((Address))
    Customer --- CustomerID
    Customer --- CustomerName
    Customer --- CustomerPhone
    Customer --- CustomerAddress

    %% Bill Entity and Attributes
    Bill[Bill]
    BillID((ID))
    BillTotal((Total Amount))
    BillTax((Tax))
    BillPayment((Payment Mode))
    BillDate((Date))
    Bill --- BillID
    Bill --- BillTotal
    Bill --- BillTax
    Bill --- BillPayment
    Bill --- BillDate

    %% Relationships
    Creates{Creates}
    Has{Has}
    Generates{Generates}
    Contains{Contains}

    User --- Creates --- Product
    Customer --- Has --- Bill
    User --- Generates --- Bill
    Bill --- Contains --- Product

    %% Relationship Cardinalities
    Creates --o| Product
    Has --o| Bill
    Generates --o| Bill
    Contains --o| Product

    %% Styling
    classDef entity fill:#f9f,stroke:#333,stroke-width:2px
    classDef attribute fill:#bbf,stroke:#333,stroke-width:1px
    classDef relationship fill:#dfd,stroke:#333,stroke-width:1px

    class User,Product,Customer,Bill entity
    class UserID,UserName,UserEmail,UserPassword,UserVerified,ProductID,ProductName,ProductCategory,ProductPrice,ProductImage,ProductStock,CustomerID,CustomerName,CustomerPhone,CustomerAddress,BillID,BillTotal,BillTax,BillPayment,BillDate attribute
    class Creates,Has,Generates,Contains relationship
```

## Diagram Explanation

1. **Entities (Rectangles)**
   - User: System user who manages the POS
   - Product: Items available for sale
   - Customer: Buyers who make purchases
   - Bill: Sales transaction records

2. **Attributes (Ovals)**
   - Each entity has its specific attributes
   - Primary keys are marked with ID
   - Contains both required and optional fields

3. **Relationships (Diamonds)**
   - Creates: Users create products
   - Has: Customers have bills
   - Generates: Users generate bills
   - Contains: Bills contain products

4. **Cardinality**
   - --o| represents "many" relationship
   - --- represents "one" relationship

This diagram follows the classic ER diagram notation style with:
- Entities in rectangles
- Attributes in ovals
- Relationships in diamonds
- Clear connections between all components
