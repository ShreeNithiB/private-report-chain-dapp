// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReportChain {
    struct CIDVersion {
        string cid;
        address updatedBy;
        uint256 timestamp;
    }

    struct Report {
        string reportId;
        // Since we cannot return an array of structs easily if nested, wait, in 0.8 it's supported.
        CIDVersion[] cidHistory;
        bool exists;
    }

    mapping(string => Report) private reports;
    mapping(address => bool) public registeredPolice;

    address public admin;

    event ReportCreated(string reportId, string initialCID, address creator);
    event ReportUpdated(string reportId, string newCID, address updater);
    event PoliceAdded(address newPolice, address addedBy);

    modifier onlyPolice() {
        require(registeredPolice[msg.sender], "Not a registered police officer");
        _;
    }

    modifier onlyAdminOrPolice() {
        require(msg.sender == admin || registeredPolice[msg.sender], "Not admin or police");
        _;
    }

    constructor() {
        admin = msg.sender;
        registeredPolice[msg.sender] = true;
    }

    function createReport(string memory _reportId, string memory _cid) public {
        require(!reports[_reportId].exists, "Report already exists");

        Report storage newReport = reports[_reportId];
        newReport.reportId = _reportId;
        newReport.exists = true;
        
        newReport.cidHistory.push(CIDVersion({
            cid: _cid,
            updatedBy: msg.sender,
            timestamp: block.timestamp
        }));

        emit ReportCreated(_reportId, _cid, msg.sender);
    }

    function updateReport(string memory _reportId, string memory _newCID) public onlyPolice {
        require(reports[_reportId].exists, "Report does not exist");

        reports[_reportId].cidHistory.push(CIDVersion({
            cid: _newCID,
            updatedBy: msg.sender,
            timestamp: block.timestamp
        }));

        emit ReportUpdated(_reportId, _newCID, msg.sender);
    }

    function getCIDHistory(string memory _reportId) public view returns (CIDVersion[] memory) {
        require(reports[_reportId].exists, "Report does not exist");
        return reports[_reportId].cidHistory;
    }

    function addPolice(address _address) public onlyAdminOrPolice {
        require(!registeredPolice[_address], "Already a registered police officer");
        registeredPolice[_address] = true;
        emit PoliceAdded(_address, msg.sender);
    }

    function isRegisteredPolice(address _address) public view returns (bool) {
        return registeredPolice[_address];
    }
}
