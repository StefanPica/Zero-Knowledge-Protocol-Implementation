package org.zkp.backend.Service;

import org.zkp.backend.Domain.*;
import org.zkp.backend.Repository.*;
import org.zkp.backend.DTO.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VerificationService {

    @Autowired private RequestRepository requestRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private PropertyRepository propertyRepo;


    public VerificationRequest createRequest(CreateRequestDTO dto) {
        User landlord = userRepo.findById(dto.getLandlordId()).orElseThrow();
        User tenant = userRepo.findById(dto.getTenantId()).orElseThrow();
        Property property = propertyRepo.findById(dto.getPropertyId()).orElseThrow();

        VerificationRequest req = new VerificationRequest();
        req.setTenant(tenant);
        req.setProperty(property);
        req.setSecretThreshold(dto.getThreshold()); // Save secret to DB
        req.setStatus(RequestStatus.PENDING);

        return requestRepo.save(req);
    }

    public List<TenantInboxDTO> getTenantInbox(Long tenantId) {
        List<VerificationRequest> requests = requestRepo.findByTenantId(tenantId);

        return requests.stream().map(req -> new TenantInboxDTO(
                req.getId(),
                req.getProperty().getName(),
                req.getProperty().getLandlord().getUsername(),
                req.getStatus().toString(),
                req.getResult() != null ? req.getResult().toString() : "NONE",
                req.getCreatedAt().toString()
        )).collect(Collectors.toList());
    }

    public VerificationRequest processVerification(Long requestId, VerificationSubmissionDTO submission) {
        VerificationRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setProofData(submission.getProofString());

        req.setStatus(RequestStatus.COMPLETED);

        if(submission.isDenied())
            req.setResult(VerificationResult.DENIED);
        else {
            if (submission.isPassed()) {
                req.setResult(VerificationResult.PASS);
            } else {
                req.setResult(VerificationResult.FAIL);
            }
        }
        return requestRepo.save(req);
    }



    public Integer getThresholdForCalculation(Long requestId) {
        VerificationRequest req = requestRepo.findById(requestId).orElseThrow();
        return req.getSecretThreshold();
    }



    public User registerUser(User user) {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        return userRepo.save(user);
    }


    public User loginUser(String username, String password) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }


    public VerificationRequest createRequestByUsername(String landlordUsername, String tenantUsername, String propertyName, Integer threshold) {
        User landlord = userRepo.findByUsername(landlordUsername).orElseThrow();
        User tenant = userRepo.findByUsername(tenantUsername)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));


        Property property = propertyRepo.findByLandlordId(landlord.getId()).stream()
                .filter(p -> p.getName().equalsIgnoreCase(propertyName))
                .findFirst()
                .orElseGet(() -> {
                    Property newProp = new Property();
                    newProp.setName(propertyName);
                    newProp.setAddress("123 Generated St");
                    newProp.setLandlord(landlord);
                    newProp.setDefaultThreshold(threshold);
                    return propertyRepo.save(newProp);
                });

        VerificationRequest req = new VerificationRequest();
        req.setTenant(tenant);
        req.setProperty(property);
        req.setSecretThreshold(threshold);
        req.setStatus(RequestStatus.PENDING);
        req.setResult(VerificationResult.NONE);

        return requestRepo.save(req);
    }


    public List<TenantInboxDTO> getLandlordOutbox(Long landlordId) {
        return requestRepo.findByPropertyLandlordId(landlordId).stream().map(req -> new TenantInboxDTO(
                req.getId(),
                req.getProperty().getName(),
                req.getTenant().getUsername(),
                req.getStatus().toString(),
                req.getResult() != null ? req.getResult().toString() : "NONE",
                req.getCreatedAt().toString()
        )).collect(Collectors.toList());
    }
}