package org.zkp.backend.Controller;

import org.zkp.backend.DTO.*;
import org.zkp.backend.Service.*;
import org.zkp.backend.Domain.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "http://localhost:3000")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody CreateRequestDTO dto) {
        return ResponseEntity.ok(verificationService.createRequest(dto));
    }

    @GetMapping("/inbox/{tenantId}")
    public ResponseEntity<List<TenantInboxDTO>> getInbox(@PathVariable Long tenantId) {
        return ResponseEntity.ok(verificationService.getTenantInbox(tenantId));
    }


    @GetMapping("/parameters/{requestId}")
    public ResponseEntity<Integer> getProofParams(@PathVariable Long requestId) {
        return ResponseEntity.ok(verificationService.getThresholdForCalculation(requestId));
    }


    @PostMapping("/submit/{requestId}")
    public ResponseEntity<?> submitProof(@PathVariable Long requestId,
                                         @RequestBody VerificationSubmissionDTO submission) {
        System.out.println("Request ID: " + requestId);
        if (submission.isDenied()) {
            System.out.println("ACTION: DENIED");
        } else {
            System.out.println("ZK-PROOF DATA RECEIVED:");
            String preview = submission.getProofString().substring(0, Math.min(submission.getProofString().length(), 100));
            System.out.println(preview + "... [truncated]");

            System.out.println("VERIFICATION RESULT: " + (submission.isPassed() ? "PASS" : "FAIL"));
        }
        System.out.println("============================================\n");

        return ResponseEntity.ok(verificationService.processVerification(requestId, submission));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(verificationService.registerUser(user));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        try {
            User user = verificationService.loginUser(creds.get("username"), creds.get("password"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/landlord/request")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(verificationService.createRequestByUsername(
                (String) payload.get("landlordUsername"),
                (String) payload.get("tenantUsername"),
                (String) payload.get("propertyName"),
                Integer.parseInt((String) payload.get("threshold"))
        ));
    }

    @GetMapping("/landlord/outbox/{landlordId}")
    public ResponseEntity<?> getLandlordOutbox(@PathVariable Long landlordId) {
        return ResponseEntity.ok(verificationService.getLandlordOutbox(landlordId));
    }


}