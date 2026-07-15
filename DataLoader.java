package org.zkp.backend.App;

import org.zkp.backend.Domain.*;
import org.zkp.backend.Repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PropertyRepository propertyRepo;
    private final RequestRepository requestRepo;

    public DataLoader(UserRepository userRepo, PropertyRepository propertyRepo, RequestRepository requestRepo) {
        this.userRepo = userRepo;
        this.propertyRepo = propertyRepo;
        this.requestRepo = requestRepo;
    }

    @Override
    public void run(String... args) {
        // 1. Create Users
        User landlord = new User();
        landlord.setUsername("Landlord_John");
        landlord.setRole(UserRole.LANDLORD);
        userRepo.save(landlord);

        User tenant = new User();
        tenant.setUsername("Tenant_Alex"); // ID will be 2
        tenant.setRole(UserRole.TENANT);
        userRepo.save(tenant);

        Property apt = new Property();
        apt.setName("Downtown Loft 4B");
        apt.setAddress("123 Main St");
        apt.setLandlord(landlord);
        apt.setDefaultThreshold(5000);
        propertyRepo.save(apt);

        VerificationRequest req = new VerificationRequest();
        req.setTenant(tenant);
        req.setProperty(apt);
        req.setSecretThreshold(5000);
        req.setStatus(RequestStatus.PENDING);
        requestRepo.save(req);
        
    }
}