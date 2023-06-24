 export class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  subtract(vector) {
    return new Vector3(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z
    );
  }

  negate() {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  dotProduct(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  cross(vector) {
    return new Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }
  
  copy() {
    return new Vector3(this.x, this.y, this.z);
  }
}

export class Simplex {
  constructor() {
    this.vertices = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
    this.size = 0;
  }

  setVertices(list) {
    for (let i = 0; i < list.length && i < 4; i++) {
      this.vertices[i] = list[i];
    }
    this.size = Math.min(list.length, 4);
  }

  insert(vertex) {
    this.vertices.splice(0, 0, vertex);
    this.vertices.length = 4;
    this.size = Math.min(this.size + 1, 4);
  }

  getVertex(index) {
    return this.vertices[index];
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.size; i++) {
      yield this.vertices[i];
    }
  }
}

 export function far_point(direction, ...vectors) {
  let result = null;
  let maxDotProduct = -Infinity;

  for (let vector of vectors) {
    let dotProduct = direction.dotProduct(vector);

    if (dotProduct > maxDotProduct) {
      maxDotProduct = dotProduct;
      result = vector;
    }
  }

  return result;
}

export function support_point(direction, vectors1, vectors2) {
  return far_point(direction, ...vectors1).subtract(  far_point(direction.negate(), ...vectors2));
}

 export function GJK(vectors1, vectors2) {
  let direction = new Vector3(1, 0, 0);
   let  s_p = support_point(direction, vectors1, vectors2);
  let point = new Simplex();
  point.insert(s_p);
  direction = s_p.negate();

  while (true) {
    s_p = support_point(direction, vectors1, vectors2);

    if (s_p.dotProduct(direction) <= 0) {
      return false;
    }

    point.insert(s_p);

    if (check_case(direction, point)) {
      return true;
    }
  }
}

export function check_case(direction, point) {
  if (point.size === 2) {
    return line_case(direction, point);
  }

  if (point.size === 3) {
    return tri_case(direction, point);
  }

  if (point.size === 4) {
    return tetra_case(direction, point);
  }

  return false; 
}

export function line_case(direction, point) {
  const a = point.getVertex(0);
  const b = point.getVertex(1);

  const ab = b.subtract(a);
  const ao = a.negate();

  if (ab.dotProduct(ao) > 0) {
    direction.copy(ab.cross(ao).cross(ab));
    point.setVertices([a, b]);
  } else {
    direction.copy(ao);
    point.setVertices([a]);
  }

  return false;
}

 export function tri_case(direction, point) {
  const a = point.getVertex(0);
  const b = point.getVertex(1);
  const c = point.getVertex(2);

  const ab = b.subtract(a);
  const ac = c.subtract(a);
  const ao = a.negate();

  const abc = ab.cross(ac);

  if (abc.cross(ac).dotProduct(ao) > 0) {
    if (ac.dotProduct(ao) > 0) {
      point.setVertices([a, c]);
      direction=(ac.cross(ao).cross(ac));
    } else {
      return line_case(direction, point);
    }
  } else {
    if (ab.cross(abc).dotProduct(ao) > 0) {
      return line_case(direction, point);
    } else {
      if (abc.dotProduct(ao) > 0) {
        direction.copy(abc);
      } else {
        point.setVertices([a, c, b]);
        direction.copy(abc.negate());
      }
    }
  }

  return false;
}

export function tetra_case(direction, point) {
  const a = point.getVertex(0);
  const b = point.getVertex(1);
  const c = point.getVertex(2);
  const d = point.getVertex(3);

  const ab = b.subtract(a);
  const ac = c.subtract(a);
  const ad = d.subtract(a);
  const ao = a.negate();

  const abc = ab.cross(ac);
  const acd = ac.cross(ad);
  const adb = ad.cross(ab);

  if (abc.dotProduct(ao) > 0) {
    return tri_case(direction, point);
  }

  if (acd.dotProduct(ao) > 0) {
    return tri_case(direction, point);
  }

  if (adb.dotProduct(ao) > 0) {
    return tri_case(direction, point);
  }

  return true;
}


