/**
 * @swagger
 * /register:
 *   post:
 *     summary: Admin Registration
 *     description: Registers a new admin.
 *     tags:
 *       - Administrator
 *     parameters:
 *       - name: username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Registration of new admin is successfully.
 *       500:
 *         description: An error occurred during registration.
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary:  Admin Login
 *     description: Logs in a admin.
 *     tags:
 *       - Administrator
 *     parameters:
 *       - name: username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Login successfully.
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /visitorData:
 *   post:
 *     summary: Create a visitor
 *     description: Create a New Visitor
 *     tags:
 *       - Visitors
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *       - name: visitorname
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phoneNumber
 *         in: formData
 *         required: true
 *         type: string
 *       - name: age
 *         in: formData
 *         required: true
 *         type: string
 *       - name: gender
 *         in: formData
 *         required: true
 *         type: string
  *       - name: visitingPurpose
 *         in: formData
 *         required: true
 *         type: string
 *       - name: visitingPerson
 *         in: formData
 *         required: true
 *         type: string
 *       - name: visitedDate
 *         in: formData
 *         required: true
 *         type: string
 *       - name: timeIn
 *         in: formData
 *         required: true
 *         type: string
*       - name: timeOut
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Visitor record created successfully.
 *       401:
 *         description: Invalid token
 *       500:
 *         description: An error occurred while creating the visitor record
 */ 

/**
 * @swagger
 * /visitor/{id}:
 *   put:
 *     summary: Update a visitor
 *     description: To update details of a visitor.
 *     tags:
 *       - Visitors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - name: visitorname
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phoneNumber
 *         in: formData
 *         required: true
 *         type: string
 *       - name: age
 *         in: formData
 *         required: true
 *         type: string
 *       - name: gender
 *         in: formData
 *         required: true
 *         type: string
 *       - name: visitingPurpose
 *         in: formData
 *         required: true
 *         type: string
 *       - name: visitingPerson
 *         in: formData
 *         required: true
 *         type: string
 *       - name: visitedDate
 *         in: formData
 *         required: true
 *         type: string
 *       - name: timeIn
 *         in: formData
 *         required: true
 *         type: string
 *       - name: timeOut
 *         in: formData
 *         required: true
 *         type: string 
 *     requestBody:
 *       description: Visitor data to update
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "John Doe"
 *             phoneNumber: "1234567890"
 *             visitingPurpose: "Meeting"
 *             visitingPerson: "Jane Doe"
 *             visitedDate: "2023-01-01"
 *             timeIn: "12:00 PM"
 *             timeOut: "02:00 PM"
 *             vehicleType: "Car"
 *     responses:
 *       200:
 *         description: Visitor updated successfully
 *       404:
 *         description: Visitor not found
 *       500:
 *         description: An error occurred while updating the visitor
 */

/**
 * @swagger
 * /visitor/{id}:
 *   delete:
 *     summary: Delete a visitor
 *     description: Use this route to delete a visitor by its ID.
 *     tags:
 *       - Visitors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the visitor to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor deleted successfully
 *       404:
 *         description: Visitor not found
 *       500:
 *         description: An error occurred while deleting the visitor
 */

/**
 * @swagger
 * /allvisitors:
 *   get:
 *     summary: Get all visitors
 *     description: To retrieve a list of all visitors.
 *     tags:
 *       - Visitors
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all visitors
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: An error occurred while retrieving the visitors
 */

/**
 * @swagger
 * /issuepass:
 *   post:
 *     summary: Issue a visitor pass
 *     description: To issue a visitor pass.
 *     tags:
 *       - Visitor Pass
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Visitor pass details
 *       required: true
 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _Id:
 *                 type: string
 *               issuedBy:
 *                 type: string
 *               validUntil:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Visitor pass issued successfully.
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: An error occurred while issuing the pass
 */

/**
 * @swagger
 * /retrievepass/{_id}:
 *   get:
 *     summary: Retrieve a visitor pass
 *     description: To retrieve details of a visitor pass.
 *     tags:
 *       - Visitor Pass
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor pass retrieved successfully
 *       404:
 *         description: Visitor pass not found
 *       500:
 *         description: An error occurred while retrieving the pass
 */