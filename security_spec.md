# Security Specification for EduProctor

## Data Invariants
1. An Assignment must belong to an existing Exam, Room, and Teacher.
2. Only Institution admins or collaborators can read/write data for that institution.
3. Teachers cannot modify their own assignments (system-only).
4. Student grades must be managed by authenticated staff.

## The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: Attempt to create an institution without being logged in.
2. **Identity Spoofing**: Attempt to set `adminId` to a different user than the sender.
3. **Privilege Escalation**: A collaborator attempting to delete the main institution document.
4. **Cross-Tenant Read**: User A attempting to read User B's institution data.
5. **Cross-Tenant Write**: User A attempting to add a teacher to User B's institution.
6. **Shadow Update**: Adding an `isAdmin: true` field to a teacher profile.
7. **Resource Poisoning**: High-frequency creation of rooms with 1MB junk names.
8. **Invalid Relation**: Creating an assignment with a non-existent `examId`.
9. **State Locking Bypass**: Modifying a locked exam schedule.
10. **PII Leak**: Reading all teacher emails without being the institution owner.
11. **Mass Delete**: Attempting to delete the entire `teachers` collection.
12. **Field Injection**: Injecting a `seniority: 999` into a teacher profile by the teacher themselves.

## Test Runner
(Implementing in firestore.rules.test.ts)
