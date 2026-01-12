from thefuzz import fuzz
 

def resolve_identity(applicant, target_db_entry):
    """
    Compares an applicant's details with a target database entry using fuzzy matching.
    
    Args:
        applicant (dict): Contains 'Name' and 'Address'.
        target_db_entry (dict): Contains 'Name' and 'Address' keys.
        
    Returns:
        dict: {
            "match": bool,
            "confidence_score": float,
            "details": str
        }
    """
    
    # Calculate Name Similarity
    name_score = fuzz.token_sort_ratio(applicant['Name'], target_db_entry['Name'])
    
    # Calculate Address Similarity
    address_score = fuzz.token_set_ratio(applicant['Address'], target_db_entry['Address'])
    
    # Weighted Confidence Score (Name matters more)
    confidence = (name_score * 0.6) + (address_score * 0.4)
    
    # Exact Match Logic
    if name_score > 85 and address_score > 70:
        return {
            "match": True,
            "confidence_score": confidence,
            "details": f"Name: {name_score}%, Addr: {address_score}%"
        }
    
    return {
        "match": False,
        "confidence_score": confidence,
        "details": f"Name: {name_score}%, Addr: {address_score}%"
    }
