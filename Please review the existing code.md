Please review the existing code. I want to refactor our current functionality to strictly adhere to the rules defined in `CLAUDE.md`. 

Please do this in a step-by-step process. Do not execute all changes at once. 

Step 1: Scan the domain models and entities. Remove manual getters, setters, equals, hashcode, and constructors, replacing them with the appropriate Lombok annotations.
Step 2: Scan our existing REST Controllers. Reverse-engineer them into the `api/openapi.yaml` file so we establish our contract-first baseline. 
Step 3: Review our JPA Entities and ensure they are aligned with PostgreSQL standards. Generate a baseline Flyway migration script in `src/main/resources/db/migration` representing the current schema.

Before writing any files, outline the exact files you plan to modify and ask for my confirmation to proceed with Step 1.